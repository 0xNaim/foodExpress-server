"use strict";

/**
 * order controller
 */

const stripe = require("stripe")(process.env.STRIPE_SK);
const shortid = require("shortid");
const { createCoreController } = require("@strapi/strapi").factories;

module.exports = createCoreController("api::order.order", ({ strapi }) => ({
  async create(ctx) {
    const { user } = ctx.state;
    const { items, amount, shippingAddress, token } = ctx.request.body;

    await stripe.charges.create({
      // Transform cents to dollars
      amount,
      currency: "usd",
      source: token,
      description: `Order ${new Date()} by ${ctx.state.user._id}`,
    });

    // Register the order in the database
    const order = await strapi.db.query("api::order.order").create({
      data: {
        user: user.id,
        order_id: shortid.generate(),
        items,
        amount,
        shippingAddress,
      },
    });

    return order;
  },
}));
