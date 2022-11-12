"use strict";
const stripe = require("stripe")(process.env.STRIPE_SK);
const shortid = require("shortid");

/**
 * order controller
 */

const { createCoreController } = require("@strapi/strapi").factories;

module.exports = createCoreController("api::order.order", ({ strapi }) => ({
  async create(ctx) {
    const { user } = ctx.state;
    const { items, total, shippingAddress, token } = ctx.request.body;

    console.log(ctx.request.body);

    const stripeAmount = Math.floor(amount * 100);
    await stripe.charges.create({
      // Transform cents to dollars
      amount: stripeAmount,
      currency: "usd",
      source: token,
      description: `Order ${new Date()} by ${ctx.state.user._id}`,
    });

    // Register the order in the database
    const order = await strapi.services.order.create.create({
      user: user.email,
      order_id: shortid.generate(),
      items,
      total,
      shippingAddress,
    });

    return order;
  },
}));
