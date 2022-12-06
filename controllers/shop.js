//  core module imports 
const fs = require('fs');
const path= require('path');
const dirname =  path.dirname;

// third party module imports 
const e = require('connect-flash');
const  mongoose  = require('mongoose');
// my imports(models)
const Product = require('../models/product');
const user = require('../models/user');
const User = require('../models/user');
const Order =  require('../models/order');

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
	user.addToCart(product);
	res.redirect('/cart');


};
exports.getCart = async (req, res, next) => {
	const user= await User.findById(req.session.user._id);
	let cart = await user.getCart();
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
    await user.deleteCart(product)
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

exports.getOrders = async (req, res, next) => {
	let userOrder =  await Order.find(),totalPrice = 0;
      userOrder =  userOrder.map((order,index)=>{
      const formatedDate =  new Date(order.date).toLocaleDateString();
	  order.formatedDate =  formatedDate;
	  return  order;
	 })
	 
      userOrder =  userOrder.map((order,index)=>{
		let priceSum =  0;
		order.products.forEach(product=>
		priceSum += product.qty * product.price
		)
		order.orderPrice =  priceSum;
		totalPrice += order.orderPrice;
		return  order;
	 })

	res.render('shop/orders', {
		path: '/orders',
		orders:userOrder,
		totalPrice,
		pageTitle: 'Your Orders',
	});
};

exports.postOrder = async (req, res, next) => {
	const user = await User.findById(req.session.user._id);
	const order =  new Order({
		products: user.cart.items,
		user:{
			userId:user._id,
			username: user.username,
		}
	})
	await order.save();
	user.cart.items= [];
	await user.save();
	res.redirect('/orders');   
	
};

exports.removeOrder = async (req, res, next) => {
	const orderId =  req.params.orderId;
	const order =  await Order.deleteOne({_id:orderId});
	res.redirect('/orders');   
	
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
