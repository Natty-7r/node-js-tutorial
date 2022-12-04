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
const User = require('../models/user');
// const { dirname } = require('path');

exports.getIndex =async  (req, res, next) => {
	try {

   const products =await  Product.find({});
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

exports.getProducts = async (req, res, next) => {
	try{
   const products =await  Product.find()
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
exports.getProductDetail = async  (req, res, next) => {
	const prodId = req.params.productId;
    const product = await Product.findById(prodId);
		res.render('shop/product-detail', {
			product,
			pageTitle: 'Product Detail',
			path: `/products`,
		});

};

exports.postCart = async (req, res, next) => {   
	const prodId = req.body.productId;
	const userOld=  req.session.user;

	const product =  await Product.findById(prodId);
	
	const user =  new User(userOld.email,userOld.password,userOld.username,userOld.cart,userOld._id);
	
	user.addToCart(product);
	res.redirect('/cart');


};
exports.getCart = async (req, res, next) => {
	const userOld=  req.session.user;	
	const user =  new User(userOld.email,userOld.password,userOld.username,userOld.cart,userOld._id);
	const cart = user.getCart();
	
	res.render('shop/cart', {
	    cart,
		path: '/cart',
		pageTitle: 'Your Cart',
	});
		
	
};
exports.deleteCart = (req, res, next) => {
	const cartId = req.params.prodId;
	const userOld=  req.session.user;	
	const user =  new User(userOld.email,userOld.password,userOld.username,userOld.cart,userOld._id);
	user.deleteCart(cartId);
	res.redirect('/cart');
	
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
