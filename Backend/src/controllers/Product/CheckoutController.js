import { User, Product, Booking } from "../../models/index.js";

import Stripe from "stripe";

export const getCheckoutSession = async (req, res) => {
  try {
    // 🔹 Validate User
    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    // 🔹 Validate Cart Items
    const { items } = req.body;
    if (!items || items.length === 0) {
      return res.status(400).json({ success: false, message: "Cart is empty" });
    }

    // 🔹 Validate Products Exist
    const productIds = items.map((item) => item._id);
    const products = await Product.find({ _id: { $in: productIds } });

    if (products.length !== items.length) {
      return res.status(400).json({ success: false, message: "Some products not found" });
    }

    // 🔹 Create Stripe Line Items
    const lineItems = products.map((product) => {
      const cartItem = items.find((item) => item._id.toString() === product._id.toString());
      return {
        price_data: {
          currency: "usd",
          unit_amount: product.price * 100, // Convert dollars to cents
          product_data: {
            name: product.name,
            description: product.description,
            images: product.images?.length ? [product.images[0].url] : [], // Use only first image
          },
        },
        quantity: cartItem.quantity,
      };
    });

    // 🔹 Initialize Stripe
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

    // 🔹 Create Stripe Checkout Session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      success_url: `${process.env.CLIENT_SITE_URL}/checkout-success`,
      cancel_url: `${process.env.CLIENT_SITE_URL}/cart`,
      customer_email: user.email,
      metadata: { userId: req.userId },
      shipping_address_collection: { allowed_countries: ["US", "CA", "GB"] },
      line_items: lineItems,
    });

    // 🔹 Calculate Total Order Amount
    const totalAmount = items.reduce((total, item) => {
      const product = products.find((p) => p._id.toString() === item._id.toString());
      return total + product.price * item.quantity;
    }, 0);

    // 🔹 Create Booking in Database
    const booking = new Booking({
      user: req.userId,
      orderItems: items.map((item) => ({
        product: item._id,
        quantity: item.quantity,
        price: products.find((p) => p._id.toString() === item._id.toString()).price,
      })),
      totalAmount,
      stripeSessionId: session.id,
      paymentStatus: "pending",
    });

    await booking.save();

    res.status(200).json({
      success: true,
      message: "Checkout session created",
      sessionId: session.id,
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


export const handleStripeWebhook = async (req, res) => {
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
  const signature = req.headers["stripe-signature"];

  try {
    // 🔹 Verify Webhook Signature
    const event = stripe.webhooks.constructEvent(
      req.rawBody, // Ensure raw body is used
      signature,
      process.env.STRIPE_WEBHOOK_SECRET
    );

    // 🔹 Handle Payment Completion
    if (event.type === "checkout.session.completed") {
      const session = event.data.object;

      // 🔹 Find and Update Booking
      const booking = await Booking.findOneAndUpdate(
        { stripeSessionId: session.id },
        {
          paymentStatus: "completed",
          orderStatus: "processing",
          shippingAddress: session.shipping?.address
            ? {
                street: session.shipping.address.line1,
                city: session.shipping.address.city,
                state: session.shipping.address.state,
                zipCode: session.shipping.address.postal_code,
                country: session.shipping.address.country,
              }
            : null, // If no shipping address provided, set it as null
        }
      );

      if (!booking) {
        console.error("Booking not found for session:", session.id);
      }
    }

    res.json({ received: true });
  } catch (error) {
    console.error("Webhook error:", error);
    res.status(400).send(`Webhook Error: ${error.message}`);
  }
};
