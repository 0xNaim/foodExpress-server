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
    const { items, amount, shippingAddress, token } = ctx.request.body;

    try {
      await stripe.charges.create({
        amount,
        currency: "usd",
        source: token,
        description: `Order ${new Date()} by ${user.email}`,
      });

      // Register the order in the database
      const order = await strapi.db.query("api::order.order").create({
        data: {
          user: user.id,
          user_email: user.email,
          order_id: shortid.generate(),
          items,
          amount,
          shippingAddress,
          publishedAt: new Date(),
        },
      });

      return order;
    } catch (error) {
      return error;
    }
  },
}));
