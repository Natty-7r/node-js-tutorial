// const Product = require('../models/product');
// const Cart = require('../models/cart');
// const url = require('url');
// const path = require('path');
// const rootDir = require('../util/path');
// const { render } = require('pug');
// const { truncate } = require('../models/cart');
const e = require('connect-flash');
const fs = require('fs');
const  mongoose  = require('mongoose');
const mongodb =  require('mongodb');
const Product = require('../models/product');
const user = require('../models/user');
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
	const user = await User.findById(req.session.user._id);
	const product =  await Product.findById(prodId);
	let cartProduct;

	let productIndex  =  user.cart.items.findIndex(product=> {
		return product.productId==prodId;
	});
	if(productIndex!=-1){
      user.cart.items[productIndex].qty++;
	}
	else{
		cartProduct ={
		productId:product._id.toString(),
		title:product.title,
		price:product.price,
		qty:1,
	}  ;
	user.cart.items.push(cartProduct);
	}
	await user.save();
	res.redirect('/cart');


};
exports.getCart = async (req, res, next) => {
	const user= await User.findById(req.session.user._id);
	let cart =  user.cart,totalPrice = 0;
	user.cart.items.forEach(item=> totalPrice+=(+item.qty*+item.price));
	cart.totalPrice =  totalPrice;
	
	res.render('shop/cart', {
	    cart,
		path: '/cart',
		pageTitle: 'Your Cart',
	});
		
	
};
exports.deleteCart = async (req, res, next) => {
	const cartId = req.params.prodId;
	const user =  await User.findById(req.session.user._id);
	const product =  await Product.findById(cartId);

	let productIndex  =  user.cart.items.findIndex(product=> {
		return product.productId==cartId;
	});
	if(user.cart.items[productIndex].qty>1){
		user.cart.items[productIndex].qty--;
	}
	else{
		user.cart.items.splice(productIndex,1);
	}
	await user.save();
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
