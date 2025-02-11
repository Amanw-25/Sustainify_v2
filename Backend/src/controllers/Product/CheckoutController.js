import { User, Product, Booking } from "../../models/index.js";
import Stripe from "stripe";

export const getCheckoutSession = async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    const { items } = req.body;

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "User not found"
      });
    }

    if (!items || !items.length) {
      return res.status(400).json({
        success: false,
        message: "No items in cart"
      });
    }

    // Extract product IDs correctly from the items array
    const productIds = items.map(item => item.productId);
    
    // Fetch all products and verify they exist and are in stock
    const products = await Product.find({ _id: { $in: productIds } });

    if (products.length !== items.length) {
      return res.status(400).json({
        success: false,
        message: "Some products not found"
      });
    }

    // Verify stock availability
    for (const product of products) {
      const cartItem = items.find(item => item.productId.toString() === product._id.toString());
      if (product.stock < cartItem.quantity) {
        return res.status(400).json({
          success: false,
          message: `${product.name} is out of stock`
        });
      }
    }

    // Create line items for Stripe
    const lineItems = products.map(product => {
      const cartItem = items.find(item => item.productId.toString() === product._id.toString());
      return {
        price_data: {
          currency: "inr",
          unit_amount: Math.round(product.price * 100), // Convert to cents and ensure integer
          product_data: {
            name: product.name,
            description: product.description,
            images: product.images?.map(img => img.url) || [],
            metadata: {
              productId: product._id.toString()
            }
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
        orderItems: JSON.stringify(items.map(item => ({
          productId: item.productId,
          quantity: item.quantity
        })))
      },
      shipping_address_collection: {
        allowed_countries: ['IN'],
      },
      shipping_options: [
        {
          shipping_rate_data: {
            type: 'fixed_amount',
            fixed_amount: {
              amount: 50,
              currency: 'inr',
            },
            display_name: 'Standard shipping',
            delivery_estimate: {
              minimum: { unit: 'business_day', value: 3 },
              maximum: { unit: 'business_day', value: 5 },
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
      error: error.message
    });
  }
};

export const verifyPayment = async (req, res) => {
  try {
    const { session_id } = req.query;

    if (!session_id) {
      return res.status(400).json({ 
        success: false, 
        message: "Session ID missing" 
      });
    }

    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
    let session;
    
    // Retrieve session with expanded line items and shipping details
    try {
      session = await stripe.checkout.sessions.retrieve(session_id, {
        expand: ['line_items', 'shipping_details']
      });
    } catch (stripeError) {
      return res.status(400).json({
        success: false,
        message: "Invalid session ID",
        error: stripeError.message
      });
    }

    if (session.payment_status !== "paid") {
      return res.status(400).json({ 
        success: false, 
        message: "Payment not completed" 
      });
    }

    // Check for existing booking to prevent duplicates
    const existingBooking = await Booking.findOne({ stripeSessionId: session_id });
    if (existingBooking) {
      return res.status(200).json({ 
        success: true, 
        message: "Payment already verified",
        booking: existingBooking 
      });
    }

    // Parse order items from session metadata
    const parsedOrderItems = JSON.parse(session.metadata.orderItems);
    
    // Create order items with product details and pricing
    const orderItems = parsedOrderItems.map(item => {
      const lineItem = session.line_items.data.find(li => 
        li.price?.product?.metadata?.productId === item.productId
      );

      return {
        product: item.productId,
        quantity: item.quantity,
        price: lineItem ? lineItem.amount_total / 100 : 0
      };
    });

    // Create and save the booking record
    const booking = new Booking({
      user: session.metadata.userId,
      orderItems,
      totalAmount: session.amount_total / 100,
      stripeSessionId: session.id,
      paymentStatus: "completed",
      orderStatus: "processing",
      shippingAddress: {
        street: session.shipping_details.address.line1,
        city: session.shipping_details.address.city,
        state: session.shipping_details.address.state,
        zipCode: session.shipping_details.address.postal_code,
        country: session.shipping_details.address.country,
      }
    });

    await booking.save();

    // Update product stock levels
    for (const item of orderItems) {
      await Product.findByIdAndUpdate(item.product, {
        $inc: { stock: -item.quantity }
      });
    }

    res.status(200).json({ 
      success: true, 
      message: "Payment verified and order created",
      booking 
    });

  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: "Error verifying payment",
      error: error.message
    });
  }
};

// Get user's orders sorted by creation date
export const getUserOrders = async (req, res) => {
  try {
    const orders = await Booking.find({ user: req.userId })
      .populate('orderItems.product')
      .sort('-createdAt');

    res.status(200).json({
      success: true,
      orders
    });

  } catch (error) {
    console.error("Get orders error:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching orders",
      error: error.message
    });
  }
};