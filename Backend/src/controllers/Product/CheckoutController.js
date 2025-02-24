import { User, Product, Booking, Cart } from "../../models/index.js";
import Stripe from "stripe";
import nodemailer from "nodemailer";
import appconfig from "../../config/appConfig.js";

export const getCheckoutSession = async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    const { items } = req.body;

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "User not found",
      });
    }

    if (!items || !items.length) {
      return res.status(400).json({
        success: false,
        message: "No items in cart",
      });
    }

    // Extract product IDs correctly from the items array
    const productIds = items.map((item) => item.productId);

    // Fetch all products and verify they exist and are in stock
    const products = await Product.find({ _id: { $in: productIds } });

    if (products.length !== items.length) {
      return res.status(400).json({
        success: false,
        message: "Some products not found",
      });
    }

    // Verify stock availability
    for (const product of products) {
      const cartItem = items.find(
        (item) => item.productId.toString() === product._id.toString()
      );
      if (product.stock < cartItem.quantity) {
        return res.status(400).json({
          success: false,
          message: `${product.name} is out of stock`,
        });
      }
    }

    // Create line items for Stripe
    const lineItems = products.map((product) => {
      const cartItem = items.find(
        (item) => item.productId.toString() === product._id.toString()
      );
      return {
        price_data: {
          currency: "inr",
          unit_amount: Math.round(product.price * 100), // Convert to cents and ensure integer
          product_data: {
            name: product.name,
            description: product.description,
            images: product.images?.map((img) => img.url) || [],
            metadata: {
              productId: product._id.toString(),
            },
          },
        },
        quantity: cartItem.quantity,
      };
    });

    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

    // Create Stripe session with shipping options
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      success_url: `${process.env.CLIENT_SITE_URL}/checkout-success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.CLIENT_SITE_URL}/cart`,
      customer_email: user.email,
      metadata: {
        userId: req.userId,
        orderItems: JSON.stringify(
          items.map((item) => ({
            productId: item.productId,
            quantity: item.quantity,
          }))
        ),
      },
      shipping_address_collection: {
        allowed_countries: ["IN"],
      },
      shipping_options: [
        {
          shipping_rate_data: {
            type: "fixed_amount",
            fixed_amount: {
              amount: 50,
              currency: "inr",
            },
            display_name: "Standard shipping",
            delivery_estimate: {
              minimum: { unit: "business_day", value: 3 },
              maximum: { unit: "business_day", value: 5 },
            },
          },
        },
      ],
      line_items: lineItems,
    });

    res.status(200).json({
      success: true,
      message: "Checkout session created",
      sessionId: session.id,
      url: session.url,
    });
  } catch (error) {
    console.error("Checkout error:", error);
    res.status(500).json({
      success: false,
      message: "Error creating checkout session",
      error: error.message,
    });
  }
};

export const verifyPayment = async (req, res) => {
  const id = req.userId;
  try {
    const { session_id } = req.query;
    if (!session_id) {
      return res.status(400).json({
        success: false,
        message: "Session ID missing",
      });
    }

    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
    let session;
    try {
      session = await stripe.checkout.sessions.retrieve(session_id, {
        expand: ["line_items", "shipping_details"],
      });
    } catch (stripeError) {
      return res.status(400).json({
        success: false,
        message: "Invalid session ID",
        error: stripeError.message,
      });
    }

    if (session.payment_status !== "paid") {
      return res.status(400).json({
        success: false,
        message: "Payment not completed",
      });
    }

    const existingBooking = await Booking.findOne({
      stripeSessionId: session_id,
    }).populate({
      path: "orderItems.product",
      model: "Product",
    });

    if (existingBooking) {
      return res.status(200).json({
        success: true,
        message: "Payment already verified",
        booking: existingBooking,
      });
    }

    const parsedOrderItems = JSON.parse(session.metadata.orderItems);

    const orderItems = await Promise.all(
      parsedOrderItems.map(async (item) => {
        const product = await Product.findById(item.productId);
        if (!product) {
          throw new Error(`Product not found for ID: ${item.productId}`);
        }
        return {
          product: item.productId,
          productName: product.name,
          quantity: item.quantity,
          price: product.price,
        };
      })
    );

    const totalAmount = orderItems.reduce((total, item) => {
      return total + item.price * item.quantity;
    }, 0);

    const booking = new Booking({
      user: session.metadata.userId,
      orderItems: orderItems,
      totalAmount: totalAmount,
      stripeSessionId: session.id,
      paymentStatus: "completed",
      paymentMethod: "card",
      orderStatus: "processing",
      shippingAddress: {
        street: session.shipping_details.address.line1,
        city: session.shipping_details.address.city,
        state: session.shipping_details.address.state,
        zipCode: session.shipping_details.address.postal_code,
        country: session.shipping_details.address.country,
      },
    });

    await booking.save();
    await Cart.findOneAndDelete({ user: id });

    for (const item of orderItems) {
      await Product.findByIdAndUpdate(item.product, {
        $inc: { stock: -item.quantity },
      });
    }

    const populatedBooking = await Booking.findById(booking._id).populate({
      path: "orderItems.product",
      model: "Product",
    });

    const user = await User.findById(session.metadata.userId);

    const orderItemsList = populatedBooking.orderItems
      .map(
        (item) => `
      <li style="margin-bottom: 10px;">
        <strong>${item.productName}</strong><br>
        Quantity: ${item.quantity}<br>
        Price: ₹${item.price}
      </li>
    `
      )
      .join("");

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: appconfig.EMAILJS_USER_ID,
        pass: appconfig.EMAILJS_USER_SECRET,
      },
      tls: {
        rejectUnauthorized: false,
      },
    });

    const mailOptions = {
      from: appconfig.EMAILJS_USER_ID,
      to: user.email,
      subject: `Order Confirmation - ${booking._id}`,
      html: `
        <html>
          <head>
            <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/all.min.css">
          </head>
          <body>
            <div style="font-family: Arial, sans-serif; padding: 20px; border: 1px solid #f1f1f1; border-radius: 10px; max-width: 600px; margin: auto; background-color: #f9f9f9;">
              <h2 style="text-align: center; color: #4CAF50;">Order Confirmation</h2>
              
              <p style="font-size: 16px; color: #555;">Dear <strong>${
                user.name
              }</strong>,</p>
              
              <p style="font-size: 16px; color: #555;">Thank you for your order! We're pleased to confirm that your payment has been successfully processed.</p>
              
              <div style="background-color: #e9f5e1; padding: 15px; border-radius: 5px; margin-top: 20px;">
                <h3 style="color: #2E7D32;">Order Details:</h3>
                <p><strong>Order ID:</strong> ${booking._id}</p>
                <p><strong>Order Date:</strong> ${
                  new Date(booking.createdAt).toLocaleDateString() +
                  " " +
                  new Date(booking.createdAt).toLocaleTimeString()
                }</p>                
                <p>Order Status: ${booking.orderStatus}</p>
                <p><strong>Total Amount:</strong> ₹${booking.totalAmount.toFixed(
                  2
                )}</p>
                
                <h4 style="color: #2E7D32;">Ordered Items:</h4>
                <ul style="list-style-type: none; padding-left: 0;">
                  ${orderItemsList}
                </ul>

                <h4 style="color: #2E7D32;">Shipping Address:</h4>
                <p>${booking.shippingAddress.street}<br>
                   ${booking.shippingAddress.city}, ${
        booking.shippingAddress.state
      }<br>
                   ${booking.shippingAddress.zipCode}, ${
        booking.shippingAddress.country
      }</p>
              </div>
    
              <p style="font-size: 16px; color: #555; margin-top: 20px;">
                We are now processing your order and will send you another email when it ships. You can track your order status using your Order ID.
              </p>
    
              <p style="font-size: 16px; color: #555;">Best regards,<br>The Sustainify Team</p>
    
              <footer style="text-align: center; margin-top: 30px; font-size: 14px; color: #888;">
                <p>If you have any questions, feel free to reach out to us at <a href="mailto:support@sustainify.com" style="color: #4CAF50;">support@sustainify.com</a>.</p>
                
                <div style="margin-top: 20px;">
                  <a href="https://twitter.com/Sustainify" target="_blank" style="margin: 0 10px; font-size: 24px; color: #1DA1F2;">
                    <i class="fab fa-twitter"></i>
                  </a>
                  <a href="https://facebook.com/Sustainify" target="_blank" style="margin: 0 10px; font-size: 24px; color: #3b5998;">
                    <i class="fab fa-facebook-f"></i>
                  </a>
                  <a href="https://www.linkedin.com/company/Sustainify" target="_blank" style="margin: 0 10px; font-size: 24px; color: #0077b5;">
                    <i class="fab fa-linkedin-in"></i>
                  </a>
                  <a href="https://instagram.com/Sustainify" target="_blank" style="margin: 0 10px; font-size: 24px; color: #C13584;">
                    <i class="fab fa-instagram"></i>
                  </a>
                </div>
              </footer>
            </div>
          </body>
        </html>
      `,
    };

    await transporter.sendMail(mailOptions);

    res.status(200).json({
      success: true,
      message: "Payment verified, order created, and confirmation email sent",
      booking: populatedBooking,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error verifying payment",
      error: error.message,
    });
  }
};

export const getUserOrders = async (req, res) => {
  try {
    const orders = await Booking.find({ user: req.userId })
      .populate("orderItems.product")
      .sort("-createdAt");

    res.status(200).json({
      success: true,
      orders,
    });
  } catch (error) {
    console.error("Get orders error:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching orders",
      error: error.message,
    });
  }
};

export const getAllOrders = async (req, res) => {
  try {
    const orders = await Booking.find()
      .populate("orderItems.product")
      .populate("user")
      .sort("-createdAt");
    res.status(200).json({
      success: true,
      orders,
    });
  } catch (error) {
    console.error("Get orders error:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching orders",
      error: error.message,
    });
  }
};

export const updateOrderStatus = async (req, res) => {
  try {
    const { id: orderId } = req.params;
    const { status } = req.body;

    const allowedStatuses = ["processing", "shipped", "delivered", "cancelled"];
    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid status value",
      });
    }

    const order = await Booking.findById(orderId).populate(
      "user",
      "name email"
    );

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    order.orderStatus = status;
    await order.save();

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: appconfig.EMAILJS_USER_ID,
        pass: appconfig.EMAILJS_USER_SECRET,
      },
      tls: {
        rejectUnauthorized: false,
      },
    });

    // Generate the order items list for the email
    const orderItemsList = order.orderItems
      .map(
        (item) =>
          `<li>${item.productName} (Quantity: ${item.quantity}) - ₹${item.price}</li>`
      )
      .join("");

    const mailOptions = {
      from: appconfig.EMAILJS_USER_ID,
      to: order.user.email,
      subject: `Order Status Update - ${order._id}`,
      html: `
        <html>
          <head>
            <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/all.min.css">
          </head>
          <body>
            <div style="font-family: Arial, sans-serif; padding: 20px; border: 1px solid #f1f1f1; border-radius: 10px; max-width: 600px; margin: auto; background-color: #f9f9f9;">
              <h2 style="text-align: center; color: #4CAF50;">Order Status Updated</h2>
              
              <p style="font-size: 16px; color: #555;">Dear <strong>${
                order.user.name
              }</strong>,</p>
              
              <p style="font-size: 16px; color: #555;">Your order status has been updated to <strong>${status}</strong>. Here are your order details:</p>
              
              <div style="background-color: #e9f5e1; padding: 15px; border-radius: 5px; margin-top: 20px;">
                <h3 style="color: #2E7D32;">Order Details:</h3>
                <p><strong>Order ID:</strong> ${order._id}</p>
                <p><strong>Order Status:</strong> ${status}</p>
                <p><strong>Total Amount:</strong> ₹${order.totalAmount}</p>
                
                <h4 style="color: #2E7D32;">Ordered Items:</h4>
                <ul>
                  ${orderItemsList}
                </ul>

                <h4 style="color: #2E7D32;">Shipping Address:</h4>
                <p>${order.shippingAddress.street}<br>
                   ${order.shippingAddress.city}, ${
        order.shippingAddress.state
      }<br>
                   ${order.shippingAddress.zipCode}, ${
        order.shippingAddress.country
      }</p>
              </div>
    
              <p style="font-size: 16px; color: #555; margin-top: 20px;">
                ${
                  status === "shipped"
                    ? "Your order is on its way! You will receive tracking details shortly."
                    : status === "delivered"
                    ? "Your order has been delivered. Thank you for shopping with us!"
                    : status === "cancelled"
                    ? "Your order has been cancelled. Please contact support if you have any questions."
                    : "We are processing your order and will update you on the next status change."
                }
              </p>
    
              <p style="font-size: 16px; color: #555;">Best regards,<br>The Sustainify Team</p>
    
              <footer style="text-align: center; margin-top: 30px; font-size: 14px; color: #888;">
                <p>If you have any questions, feel free to reach out to us at <a href="mailto:support@sustainify.com" style="color: #4CAF50;">support@sustainify.com</a>.</p>
                
                <div style="margin-top: 20px;">
                  <a href="https://twitter.com/Sustainify" target="_blank" style="margin: 0 10px; font-size: 24px; color: #1DA1F2;">
                    <i class="fab fa-twitter"></i>
                  </a>
                  <a href="https://facebook.com/Sustainify" target="_blank" style="margin: 0 10px; font-size: 24px; color: #3b5998;">
                    <i class="fab fa-facebook-f"></i>
                  </a>
                  <a href="https://www.linkedin.com/company/Sustainify" target="_blank" style="margin: 0 10px; font-size: 24px; color: #0077b5;">
                    <i class="fab fa-linkedin-in"></i>
                  </a>
                  <a href="https://instagram.com/Sustainify" target="_blank" style="margin: 0 10px; font-size: 24px; color: #C13584;">
                    <i class="fab fa-instagram"></i>
                  </a>
                </div>
              </footer>
            </div>
          </body>
        </html>
      `,
    };

    const emailResponse = await transporter.sendMail(mailOptions);

    res.status(200).json({
      success: true,
      message: "Order status updated successfully and notification email sent",
      order,
      emailResponse,
    });
  } catch (error) {
    console.error("Update order status error:", error);
    res.status(500).json({
      success: false,
      message: "Error updating order status",
      error: error.message,
    });
  }
};
