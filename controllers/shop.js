// const Product = require('../models/product');
// const Cart = require('../models/cart');
// const url = require('url');
// const path = require('path');
// const rootDir = require('../util/path');
// const { render } = require('pug');
// const { truncate } = require('../models/cart');
const e = require('connect-flash');
const fs = require('fs');
const Product = require('../models/product');
// const { dirname } = require('path');


exports.getProducts = async (req, res, next) => {
	try{
   const products =await  Product.findAll()
	return res.render('shop/product-list', {
		pageTitle: 'products',
		path: '/products',
		prods: products,
		pages: 1,
		pageNumber:1,
		linkPath: '/products',
	});
} catch (error) {
	next(error)	
}
}
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
exports.getProductDetail = async  (req, res, next) => {
	const prodId = req.params.productId;
    const product = await Product.findById(prodId);
		res.render('shop/product-detail', {
			product,
			pageTitle: 'Product Detail',
			path: `/products`,
		});

};

exports.getIndex =async  (req, res, next) => {
	try {

   const products =await  Product.findAll()
	return res.render('shop/index', {
		pageTitle: 'Shop',
		path: '/',
		prods: products,
		pages: 1,
		pageNumber:1,
		linkPath: '/',
	});
} catch (error) {
	next(error)	
}
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
	const mainRoot = dirname(process.mainModule.filename);
	let fileName = req.params.invoiceId + '.pdf';
	fileName = 'me.pdf';
	const filePath = path.join(mainRoot, 'data', 'invoice', fileName);
	const fileReadableStream = fs.createReadStream(filePath);

	res.setHeader('Content-Type', 'application/pdf');
	res.setHeader('Content-Disposition', `inline;filename="${fileName}"`);

	fileReadableStream.pipe(res);
};
