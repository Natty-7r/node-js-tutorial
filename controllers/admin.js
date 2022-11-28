const fs = require('fs');

const Cart = require('../models/cart');
const Product = require('../models/product');
const User = require('../models/user');
const { Op, where } = require('sequelize');
const path = require('path');
const { validationResult } = require('express-validator');
const { dirname } = require('path');
const mainRoot = require('../util/path');
const {getDb} =  require('../path/mongoDb')


const deleteImageSource = function (filename) {
	const filePath = path.join(
		dirname(process.mainModule.filename),
		'public',
		'images',
		filename
	);
	return fs.unlink(filePath, (err) => {
		if (err) return Promise.resolve(false);
		return Promise.resolve(true);
	});
};

//-
exports.getAddProduct = (req, res, next) => {
	try {
		res.render('admin/add-product', {
			pageTitle: 'Add Product',
			path: '/admin/add-product',
			formsCSS: true,
			productCSS: true,
			activeAddProduct: true,
			uploadError: req.flash('uploadError')[0],
			product: req.flash('product')[0],
		});
	} catch (error) {
		const err = new Error(error);
		err.statusCode = 500;
		return next(err);
	}
};
exports.postAddProduct = async (req, res, next) => {
	try {
		const title = req.body.title;
		const imgUrl = req?.file?.filename;
		const price = req.body.price;
		const description = req.body.description;
		const userId =  req.session.user._id.toString();

		const validationError = validationResult(req);
		if (!validationError.isEmpty()) {
			const product = { title, imgUrl, price, description, };
			req.flash('uploadError', validationError.array()[0].msg),
				req.flash('product', product);
			return res.redirect('/admin/add-product');
		}
		if (!imgUrl){
				const product = { title, imgUrl, price, description, userId };
				req.flash('uploadError', 'The file attached  is is not image'),
					req.flash('product', product);
				return res.redirect('/admin/add-product');
			};
		const product = new  Product(title,imgUrl,price,description,userId);
		product.save();	
		res.redirect('/admin/products')
			
	} catch (error) {
		const err = new Error(error);
		err.statusCode = 500;
		 next(err);
	}
};

exports.getEditProduct = async (req, res, next) => {
	const prodId = req.params.prodId;
	 const product = await Product.findById(prodId);
			res.render('admin/edit-product', {
				pageTitle: 'Edit Product',
				path: '/product',
				product,
				uploadError: '',
			});
		// .catch((error) => {
		// 	const err = new Error(error);
		// 	err.statusCode = 500;
		// 	return next(err);
		// });
};
exports.editProductPost = async (req, res, next) => {
	try {
		const prodId = req.body._id;
		const newTitle = req.body.title;
		const newImgUrl = req?.file?.filename;
		const newPrice = req.body.price;
		const newDescription = req.body.description;
		const validationError = validationResult(req);
		if (!validationError.isEmpty()) {
			const product = {
				id: prodId,
				title: newTitle,
				newImgUrl,
				price: newPrice,
				description: newDescription,
			};
			return res.status(422).render('admin/edit-product', {
				pageTitle: 'Edit Product',
				path: '/product',
				product,
				uploadError: validationError.array()[0].msg,
			});
		}
		if (!newImgUrl){
				const product = {
					id: prodId,
					title: newTitle,
					newImgUrl,
					price: newPrice,
					description: newDescription,
				};
				return res.status(422).render('admin/edit-product', {
					pageTitle: 'Add Product',
					path: '/admin/add-product',
					formsCSS: true,
					productCSS: true,
					activeAddProduct: true,
					product,
					reupload: true,
					uploadError: 'The file type is is not image !',
				});
			}
			
          const product =  new Product(newTitle, newImgUrl,newPrice.newDescription,req.session.user._id,prodId);
		 await product.save();
		//    deleteImageSource((await Product.findById(prodId)).imageUrl);
			res.redirect('/admin/products');
		
	} catch (error) {
		const err = new Error(error);
		err.statusCode = 500;
		return next(err);
	}
};

exports.getProducts = async (req, res, next) => {

		// try{
			const userId =  req.session.user._id;
			const userProducts =  await Product.findUserProducts(userId);
			
			return res.render('admin/products', {
				pageTitle: 'All products',
				path: '/admin/products',
				prods: userProducts,
				pages: 1,
				pageNumber:1,
				linkPath: '/products',
			});
		// }
		// catch(error) {
		// 	const err = new Error(error);
		// 	err.statusCode = 500;
		// 	return next(err);
		// };
};
exports.deleteProduct = async (req, res, next) => {
	try {
		const prodId = req.params.prodId;
		const productToDelete = await Product.findOne({ where: { id: prodId } });
		productToDelete.destroy((productsCount) => {
			fs.unlink(
				path.join(mainRoot, 'public', 'images', productToDelete.imgUrl),
				(err) => {
					if (err) next(err);
					res.redirect('/admin/products');
				}
			);
		});
	} catch (error) {
		const err = new Error(error);
		err.statusCode = 500;
		return next(err);
	}
};
