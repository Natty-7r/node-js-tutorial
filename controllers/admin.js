const fs = require('fs');

const Cart = require('../models/cart');
const Product = require('../models/product');
const User = require('../models/user');
const { Op, where } = require('sequelize');
const path = require('path');
const { validationResult } = require('express-validator');
const { dirname } = require('path');

const deleteImageSource = function (filename) {
	const filePath = path.join(
		dirname(process.mainModule.filename),
		'public',
		'images',
		filename
	);
	fs.unlink(filePath, (err) => {
		if (err) return Promise.resolve(false);
		return Promise.resolve(true);
	});
};

//-
exports.getAddProduct = (req, res, next) => {
	User.findAll().then((users) => {
		const user = users[0];
		res.render('admin/add-product', {
			pageTitle: 'Add Product',
			path: '/admin/add-product',
			formsCSS: true,
			productCSS: true,
			activeAddProduct: true,
			uploadError: req.flash('uploadError')[0],
			product: req.flash('product')[0],
		});
	});
};
exports.postAddProduct = async (req, res, next) => {
	const title = req.body.title;
	const imgUrl = req?.file?.filename;
	const price = req.body.price;
	const description = req.body.description;
	const owner = req.body.owner;

	const validationError = validationResult(req);
	if (!validationError.isEmpty()) {
		const product = { title, imgUrl, price, description, owner };
		req.flash('uploadError', validationError.array()[0].msg),
			req.flash('product', product);
		return res.redirect('/admin/add-product');
	}
	if (!imgUrl)
		return User.findAll().then((users) => {
			const product = { title, imgUrl, price, description, owner };
			req.flash('uploadError', 'The file attached  is is not image'),
				req.flash('product', product);
			return res.redirect('/admin/add-product');
		});

	const product = { title, imgUrl, price, description, owner };
	req.user
		.createProduct({
			title,
			price,
			description,
			imgUrl,
			owner,
		})
		.then(() => {
			res.redirect('/products');
		});
};

exports.editProduct = (req, res, next) => {
	const prodId = req.params.prodId;
	// Product.findAll({ where: { id: prodId } })
	req.user.getProducts({ where: { id: prodId } }).then(([product]) => {
		res.render('admin/edit-product', {
			pageTitle: 'Edit Product',
			path: '/product',
			product,
			uploadError: '',
		});
	});
};
exports.editProductPost = (req, res, next) => {
	const prodId = req.body.id;
	const newTitle = req.body.title;
	const imgUrl = req?.file?.filename;
	const newPrice = req.body.price;
	const newDescription = req.body.description;
	const validationError = validationResult(req);
	if (!validationError.isEmpty()) {
		const product = {
			id: prodId,
			title: newTitle,
			imgUrl,
			price: newPrice,
			description: newDescription,
		};
		return res.status(422).render('admin/edit-product', {
			pageTitle: 'Edit Product',
			path: '/product',
			csrfToken: '',
			product,
			uploadError: validationError.array()[0].msg,
		});
	}
	if (!imgUrl)
		return User.findAll().then((users) => {
			const product = {
				id: prodId,
				title: newTitle,
				imgUrl,
				price: newPrice,
				description: newDescription,
			};
			return res.status(422).render('admin/edit-product', {
				pageTitle: 'Add Product',
				path: '/admin/add-product',
				formsCSS: true,
				productCSS: true,
				activeAddProduct: true,
				csrfToken: '',
				product,
				reupload: true,
				uploadError: 'The file type is is not image !',
			});
		});

	req.user.getProducts({ where: { id: prodId } }).then(([productFound]) => {
		deleteImageSource(productFound.imgUrl);
		productFound.title = newTitle;
		productFound.imgUrl = imgUrl;
		productFound.price = newPrice;
		productFound.description = newDescription;
		productFound.save();
		res.redirect('/admin/products');
	});
};

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
				return res.render('admin/products', {
					pageTitle: 'All products',
					path: '/admin/products',
					prods: products,
					pages: pages,
					pageNumber,
					linkPath: '/products',
				});
			});
		})
		.catch((err) => console.error(err));
};
exports.deleteProduct = (req, res, next) => {
	const prodId = req.params.prodId;
	Product.findOne({ where: { id: prodId } }).then((product) => {
		deleteImageSource(product.imgUrl);
		product.destroy();
		res.status(200).redirect({
			message: 'success',
		});
	});
};
