const fs = require('fs');
const mongodb =  require('mongodb');
const Product = require('../models/product');
const User = require('../models/user');
const { Op, where } = require('sequelize');
const path = require('path');
const { validationResult } = require('express-validator');
const { dirname } = require('path');
const mainRoot = require('../util/path');
const { default: mongoose } = require('mongoose');


deleteImageSource = async  function (filename) {
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
		const imageUrl = req?.file?.filename;
		const price = req.body.price;
		const description = req.body.description;
		const userId =  req.session.user._id;

		const validationError = validationResult(req);
		if (!validationError.isEmpty()) {
			const product = { title, imageUrl, price, description, };
			req.flash('uploadError', validationError.array()[0].msg),
				req.flash('product', product);
			return res.redirect('/admin/add-product');
		}
		if (!imageUrl){
				const product = { title, price, description,imageUrl, userId };
				req.flash('uploadError', 'The file attached  is is not image'),
					req.flash('product', product);
				return res.redirect('/admin/add-product');
			};
		const product = new  Product({title:title,price:price,description:description,imageUrl:imageUrl,userId:userId});
		product.save()
		.then(saved => {res.redirect('/admin/products')})
		.catch(error =>console.log(error ))	
		
			
	} catch (error) {
		const err = new Error(error);
		err.statusCode = 500;
		 next(err);
	}
};

exports.getEditProduct = async (req, res, next) => {
	try{
	const prodId = req.params.prodId;
	const product = await Product.findById(prodId);
			res.render('admin/edit-product', {
				pageTitle: 'Edit Product',
				path: '/product',
				product,
				uploadError: '',
			});
		}
		catch(error) {
			const err = new Error(error);
			err.statusCode = 500;
			return next(err);
		}
};
exports.editProductPost = async (req, res, next) => {
	try {
		const prodId = req.body.prodId;
		const newTitle = req.body.title;
		const newImageUrl = req?.file?.filename;
		const newPrice = req.body.price;
		const newDescription = req.body.description;
		const validationError = validationResult(req);
		if (!validationError.isEmpty()) {
			const product = {
				_id: prodId,
				title: newTitle,
				imageUrl:null,
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
		if (!newImageUrl){
				const product = {
					_id: prodId,
					title: newTitle,
					imageUrl:null,
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
			
        const productToUpdate=  await  Product.findById(prodId);
		const oldImageSource =  productToUpdate.imageUrl;
			productToUpdate.title =  newTitle;
			productToUpdate.price =  newPrice;
			productToUpdate.description =  newDescription;			
			productToUpdate.imageUrl =  newImageUrl;
		    await 	productToUpdate.save();	 
			
	        deleteImageSource(oldImageSource);
			res.redirect('/admin/products');
		
	} catch (error) {
		const err = new Error(error);
		err.statusCode = 500;
		return next(err);
	}
};

exports.getProducts = async (req, res, next) => {
		try{
			const userProducts  =  await Product.find({userId:( req.session.user._id)});				
			return res.render('admin/products', {
				pageTitle: 'All products',
				path: '/admin/products',
				prods: userProducts,
				pages: 1,
				pageNumber:1,
				linkPath: '/products',
			});
		}
		catch(error) {
			const err = new Error(error);
			err.statusCode = 500;
			return next(err);
		};
};
exports.deleteProduct = async (req, res, next) => {
	try {
		const prodId = req.params.prodId;
		const ProductToDelete =await   Product.findById(prodId);
		deleteImageSource(ProductToDelete.imageUrl);
		await ProductToDelete.delete();
		 res.redirect('/admin/products');
		
	} catch (error) {
		const err = new Error(error);
		err.statusCode = 500;
		return next(err);
	}
};
