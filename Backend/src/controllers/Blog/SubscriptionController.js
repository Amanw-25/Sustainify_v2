import Stripe from "stripe";
import { Subscription } from "../../models/index.js";
import { User } from "../../models/index.js";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// Create a subscription checkout session
export const createSubscriptionSession = async (req, res) => {
  try {
    const { planType } = req.body;
    const user = await User.findById(req.userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Check if user already has an active subscription
    const existingSubscription = await Subscription.findOne({
      user: user._id,
      status: "active",
    });

    if (existingSubscription) {
      return res.status(400).json({
        success: false,
        message: "You already have an active subscription",
      });
    }

    const interval = planType === "monthly" ? "month" : "year";

    // Create or retrieve the product
    const product = await stripe.products.create({
      name: `${planType === "monthly" ? "Monthly" : "Yearly"} Subscription`,
      description: "Access to premium content",
    });

    const price = await stripe.prices.create({
      product: product.id,
      unit_amount: planType === "monthly" ? 4900 : 49900, // ₹49 and ₹499
      currency: "inr",
      recurring: {
        interval: interval,
      },
    });

    // FIXED SUCCESS URL: Ensure correct redirection
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price: price.id,
          quantity: 1,
        },
      ],
      mode: "subscription",
      billing_address_collection: "required",
      success_url: `${process.env.CLIENT_SITE_URL}/subscription-success?session_id={CHECKOUT_SESSION_ID}`, // Fixed URL
      cancel_url: `${process.env.CLIENT_SITE_URL}/blog`,
      customer_email: user.email,
      metadata: {
        userId: user._id.toString(),
        planType,
      },
    });

    res.status(200).json({
      success: true,
      sessionId: session.id,
      sessionUrl: session.url,
    });
  } catch (error) {
    console.error("Subscription creation error:", error);
    res.status(500).json({
      success: false,
      message: "Error creating subscription session",
    });
  }
};


// Verify subscription after successful payment
export const verifySubscription = async (req, res) => {

  const id=req.userId;
  try {
    const { session_id } = req.query; // Ensure correct param name

    if (!session_id) {
      return res.status(400).json({
        success: false,
        message: "Session ID is required",
      });
    }

    const session = await stripe.checkout.sessions.retrieve(session_id);

    if (!session || !session.subscription) {
      return res.status(404).json({
        success: false,
        message: "Session or subscription not found",
      });
    }

    const subscription = await stripe.subscriptions.retrieve(session.subscription);

    // Store subscription details in the database
    const newSubscription = await Subscription.create({
      user: session.metadata.userId,
      stripeSubscriptionId: session.subscription,
      planType: session.metadata.planType,
      status: "active",
      currentPeriodStart: new Date(subscription.current_period_start * 1000),
      currentPeriodEnd: new Date(subscription.current_period_end * 1000),
    });


    await User.findByIdAndUpdate(id, {isMember: true, membershipType: session.metadata.planType});

    res.status(200).json({
      success: true,
      subscription: newSubscription,
    });
  } catch (error) {
    console.error("Subscription verification error:", error);
    res.status(500).json({
      success: false,
      message: "Error verifying subscription",
    });
  }
};


// Get user's subscription details
export const getUserSubscription = async (req, res) => {
  try {
    const subscription = await Subscription.findOne({
      user: req.userId,
      status: "active",
    });

    if (!subscription) {
      return res.status(404).json({
        success: false,
        message: "No active subscription found",
      });
    }

    res.status(200).json({
      success: true,
      subscription,
    });
  } catch (error) {
    console.error("Get subscription error:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching subscription details",
    });
  }
};

// Cancel subscription
export const cancelSubscription = async (req, res) => {
  try {
    const subscription = await Subscription.findOne({
      user: req.userId,
      status: "active",
    });

    if (!subscription) {
      return res.status(404).json({
        success: false,
        message: "No active subscription found",
      });
    }

    // Cancel subscription in Stripe
    await stripe.subscriptions.cancel(subscription.stripeSubscriptionId);

    // Update subscription status in database
    subscription.status = "canceled";
    await subscription.save();

    res.status(200).json({
      success: true,
      message: "Subscription cancelled successfully",
    });
  } catch (error) {
    console.error("Cancel subscription error:", error);
    res.status(500).json({
      success: false,
      message: "Error cancelling subscription",
    });
  }
};