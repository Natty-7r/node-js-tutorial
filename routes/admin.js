const path = require('path');
const isAuth = require('../util/isAuth');
const express = require('express');

const multer = require('multer');
const { body: validator } = require('express-validator');
const adminController = require('../controllers/admin');
const router = express.Router();

const filter = (req, file, cb) => {
	if (
		file.mimetype == 'image/png' ||
		file.mimetype == 'image/jpg' ||
		file.mimetype == 'image/jpeg'
	)
		cb(null, true);
	else cb(null, false);
};
const storage = multer.diskStorage({
	destination: (req, file, cb) => {
		cb(null, 'public/images');
	},
	filename: (req, file, cb) => {
		const fileName =
			'/images' + Date.now() + '_' + Math.random() + '_' + file.originalname;
		cb(null, fileName);
	},
});
const upload = multer({ storage, fileFilter: filter });

const uploaded = upload.single('image');
// form validation for adding products

const validateAddproduct = function (req) {
	return [
		validator('title', 'Title can be empty  ').isLength({
			min: 3,
		}),
		validator('image').custom((value, { req }) => {
			if (!req.file) throw new Error('File attached in not file ! ');
			else {
				if (
					!(
						req.file.mimetype === 'image/png' ||
						req.file.mimetype === 'image/jpeg' ||
						req.file.mimetype === 'image/jpg'
					)
				)
					throw new Error('File attached in not file ! ');
				else return true;
			}
		}),
		validator('price', 'The price must be a number ')
			.isLength({ min: 1 })
			.isFloat(),
		validator('description', 'description can not only be empty  ').isLength({
			min: 5,
		}),
	];
};
// /admin/add-product => GET

// /admin/products => GET
router.get('/products', isAuth, adminController.getProducts);

router.get('/edit-product/:prodId', isAuth, adminController.editProduct);

router.post(
	'/edit-product',
	isAuth,
	uploaded,
	validateAddproduct(),
	adminController.editProductPost
);
router.delete('/products/:prodId', isAuth, adminController.deleteProduct);

router.post('/add-product/:prodid', isAuth, adminController.deleteProduct);

// /admin/add-product => POST
router.get('/add-product', isAuth, adminController.getAddProduct);

router.post(
	'/add-product',
	isAuth,
	uploaded,
	validateAddproduct(),
	adminController.postAddProduct
);

module.exports = router;
