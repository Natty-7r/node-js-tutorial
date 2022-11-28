const path = require('path');
const isAuth = require('../util/isAuth');
const express = require('express');

const { body: validator } = require('express-validator');
const adminController = require('../controllers/admin');
const router = express.Router();

// form validation for adding products

const validateAddproduct = [
	validator('title', 'Title can be empty  ').isLength({
		min: 3,
	}),
	validator('price', 'The price must be a number ')
		.isLength({ min: 1 })
		.isFloat(),
	validator('description', 'description can not only be empty  ').isLength({
		min: 5,
	}),
];

// /admin/add-product => GET

// /admin/products => GET
router.get('/products',isAuth, adminController.getProducts);

router.get('/edit-product/:prodId', isAuth, adminController.getEditProduct);

router.post(
	'/edit-product',
	isAuth,
	validateAddproduct,
	adminController.editProductPost
);
router.get('/delete/:prodId', isAuth, adminController.deleteProduct);

router.post('/add-product/:prodid', isAuth, adminController.deleteProduct);

// /admin/add-product => POST
router.get('/add-product', isAuth, adminController.getAddProduct);

router.post(
	'/add-product',
	isAuth,
	validateAddproduct,
	adminController.postAddProduct
);

module.exports = router;
