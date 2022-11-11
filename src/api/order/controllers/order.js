"use strict";
const stripe = require("stripe")(process.env.STRIPE_SK);

/**
 * order controller
 */

const { createCoreController } = require("@strapi/strapi").factories;

module.exports = createCoreController("api::order.order", ({ strapi }) => ({
  async create(ctx) {
    const { products, amount, shippingAddress } = ctx.request.body;

    const { user } = ctx.state;

    const BASE_URL = ctx.request.headers.origin || "http://localhost:3000";

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      customer_email: user.email,
      mode: "payment",
      success_url: `${BASE_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: BASE_URL,
      line_items: products,
    });

    // Create the order
    const newOrder = await strapi.services.order.create({
      user: user.id,
      checkout_session: session.id,
      items: products,
      amount,
      shippingAddress,
      status: "unpaid", 
    });

    return { id: session.id };
  },
}));
