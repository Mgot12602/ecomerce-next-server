"use strict";
const stripe = require("stripe")(
  "sk_test_51Hw8omAFjvuOhmpPSz9t9gPd62wSZU7O2cGW1zDSqTjLTxpNjeaNDgHfLveijeUMRYHZ5dwH0jZ7D4u8oO8ZO8x700LD0irtuI"
);

/**
 * Read the documentation (https://strapi.io/documentation/developer-docs/latest/development/backend-customization.html#core-controllers)
 * to customize this controller
 */

module.exports = {
  async create(ctx) {
    const { token, products, idUser, addressShipping } = ctx.request.body;
    console.log("idUser", idUser);
    let totalPayment = 0;
    products.forEach((product) => {
      totalPayment = totalPayment + product.price;
    });
    const charge = await stripe.charges.create({
      amount: totalPayment * 100,
      currency: "eur",
      source: token.id,
      description: `ID Usuario: ${idUser}`,
    });
    const createOrder = [];
    for await (const product of products) {
      const data = {
        game: product.id,
        user: idUser,
        totalPayment,
        idPayment: charge.id,
        addressShipping,
      };
      const validData = await strapi.entityValidator.validateEntityCreation(
        strapi.models.order,
        data
      );
      const entry = await strapi.query("order").create(validData);
      createOrder.push(entry);
    }
    return createOrder;
  },
};
