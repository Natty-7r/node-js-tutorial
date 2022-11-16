const Product = require('../models/product');
const Cart = require('../models/cart');
const url = require('url');
const path = require('path');
const rootDir = require('../util/path');
const { render } = require('pug');
const { truncate } = require('../models/cart');
const fs = require('fs');
const { dirname } = require('path');
const { query } = require('express');

exports.getProducts = (req, res, next) => {
	const productPerPage = 2;
	const pageNumber = req.query?.page ?? 1;

	Product.count({ where: { userId: req.user.id } })
		.then((productsNumber) => {
			const pages = Math.round(productsNumber / productPerPage);
			return Product.findAll({
				offset: (pageNumber - 1) * productPerPage,
				limit: productPerPage,
				where: { userId: req.user.id },
			}).then((products) => {
				return res.render('shop/product-list', {
					pageTitle: 'All products',
					path: '/products',
					prods: products,
					pages: pages,
					pageNumber,
					linkPath: '/products',
				});
			});
		})
		.catch((err) => console.error(err));
};

exports.postCart = async (req, res, next) => {
	// Cart.addProduct(prodId).then(() => {
	// 	res.redirect('/cart');
	// });
	const prodId = +req.body.productId;
	let fetchedCart;
	req.user
		.getCart()
		.then((cart) => {
			fetchedCart = cart;
			return cart.getProducts({ where: { id: prodId } });
		})
		.then((products) => {
			if (!products || products.length == 0) {
				return Product.findByPk(prodId).then((newProduct) => {
					fetchedCart.addProduct(newProduct, { through: { quantity: 1 } });
					res.redirect('/cart');
				});
			}
			if (products.length > 0) {
				products[0].cartItem.increment({ quantity: 1 });
				res.redirect('/cart');
			}
		})
		.catch((err) => console.log(err));
};
exports.getCart = (req, res, next) => {
	const isLoggedIn = req.session.isLoggedIn;
	let totalPrice;
	req.user
		.getCart()
		.then((cart) => {
			if (!cart) return [];
			return cart?.getProducts();
		})
		.then((cartProducts) => {
			if (cartProducts.length > 0) {
				totalPrice = cartProducts.reduce(
					(sum, cartProduct) =>
						sum + cartProduct.price * cartProduct.cartItem.quantity,
					0
				);
			}
			res.render('shop/cart', {
				cart: { products: cartProducts, totalPrice },
				path: '/cart',
				pageTitle: 'Your Cart',
			});
		});
	// Cart.getCart().then((cart) => {
	// 	res.render('shop/cart', {
	// 		cart,
	// 		path: '/cart',
	// 		pageTitle: 'Your Cart',
	// 	});
	// });
};
exports.deleteCart = (req, res, next) => {
	const cartId = req.params.prodId;
	req.user
		.getCart()
		.then((cart) => cart.getProducts({ where: { id: cartId } }))
		.then((cartProducts) => {
			const quantity = cartProducts[0].cartItem.quantity;
			console.log(quantity);
			if (quantity > 1) {
				cartProducts[0].cartItem.decrement({ quantity: 1 });
				res.redirect('/cart');
			}
			if (quantity == 1) {
				cartProducts[0].cartItem.destroy({
					where: { productId: cartId },
				});
				res.redirect('/cart');
			}
		});
};
exports.deleteAllCart = (req, res, next) => {
	req.user
		.getCart()
		.then((cart) => cart.getProducts())
		.then((cartProducts) => {
			cartProducts.forEach((cartProduct) =>
				cartProduct.cartItem.destroy({ truncate: true })
			);
			return Promise.resolve('all deleted');
		})
		.then((result) => res.redirect('/cart'));
};
exports.getProductDetail = (req, res, next) => {
	const prodId = req.params.productId;
	req.user.getProducts({ where: { id: prodId } }).then(([product]) => {
		res.render('shop/product-detail', {
			product,
			pageTitle: 'Product Detail',
			path: `/products`,
		});
	});
};

exports.getIndex = (req, res, next) => {
	const productPerPage = 2;
	const pageNumber = req.query?.page ?? 1;

	Product.count().then((productsNumber) => {
		const pages = Math.round(productsNumber / productPerPage);
		return Product.findAll({
			offset: (pageNumber - 1) * productPerPage,
			limit: productPerPage,
		}).then((products) => {
			return res.render('shop/index', {
				pageTitle: 'Shop',
				path: '/',
				prods: products,
				pages: pages,
				pageNumber,
				linkPath: '/',
			});
		});
	});
};

exports.getOrders = (req, res, next) => {
	res.render('shop/orders', {
		path: '/orders',
		pageTitle: 'Your Orders',
	});
};

exports.getCheckout = (req, res, next) => {
	res.render('shop/checkout', {
		path: '/checkout',
		pageTitle: 'Checkout',
	});
};
exports.getInvoice = (req, res, next) => {
	const root = dirname(process.mainModule.filename);
	const filename = req.params.invoiceId + '.pdf';
	const filepath = path.join(root, 'data', 'invoice', filename);
	fs.readFile(filepath, (err, data) => {
		if (err) return console.log(err);
		res.setHeader('Content-Type', 'application/pdf');
		res.setHeader(
			'Content-Disposition',
			'attachment;filename="' + filename + '"'
		);
		res.send(data);
	});
};
