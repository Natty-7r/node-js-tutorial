// const mongoDb =  require('mongodb');
// const getDb =  require('../path/mongoDb').getDb;

// const sequelize = require('../path/db');
// const Product = require('./product');

// class Cart extends Model {
// 	static async addProduct(prodId) {
// 		// excratcting old file
// 		try {
// 			// exctracting
// 			const [{ id, price: productPrice, title }] = await Product.findAll({
// 				where: {
// 					id: prodId,
// 				},
// 			});
// 			const [existing] = await Cart.findAll({ where: { id: prodId } });

// 			// adding new  object
// 			if (!existing) {
// 				return await Cart.create({
// 					id,
// 					qty: 1,
// 					price: productPrice,
// 					title,
// 				});
// 			} else {
// 				return await Cart.increment(
// 					{ qty: +1 },
// 					{
// 						where: { id: prodId },
// 					}
// 				);
// 			}
// 		} catch (err) {
// 			console.log(err);
// 		}
// 	}
// 	static async getCart() {
// 		try {
// 			const cart = await Cart.findAll();
// 			if (cart.length == 0) {
// 				return undefined;
// 			} else {
// 				const costArray = await Cart.findAll({
// 					attributes: [[sequelize.literal('(qty*price)'), 'cost']],
// 				});
// 				const totalPrice = costArray.reduce(
// 					(sum, currentEl) => sum + currentEl.dataValues.cost,
// 					0
// 				);

// 				return {
// 					products: cart,
// 					totalPrice,
// 				};
// 			}
// 		} catch (err) {
// 			console.log(err);
// 		}
// 	}
// 	static deleteCart(prodId) {
// 		Cart.findAll({ where: { id: prodId } }).then(([product]) => {
// 			if (product.qty <= 1) {
// 				Cart.destroy({ where: { id: prodId } });
// 			} else {
// 				Cart.decrement(
// 					{
// 						qty: 1,
// 					},
// 					{
// 						where: {
// 							id: prodId,
// 						},
// 					}
// 				);
// 			}
// 		});
// 	}
// 	static deleteAllCart() {
// 		return Cart.destroy({ truncate: true });
// 	}
// 	static async getCartById(id) {
// 		const [[cart], _] = await dbPool.query('select * from cart where id = ? ', [
// 			id,
// 		]);
// 		return cart;
// 	}
// }
// Cart.init(
// 	{
// 		id: { type: DataTypes.INTEGER, primaryKey: true },
// 	},
// 	{ sequelize, modelName: 'cart', timestamps: false }
// );



// module.exports = Cart;
