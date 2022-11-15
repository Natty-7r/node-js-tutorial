const path = require('path');
const isAuth = require('../util/isAuth');
const express = require('express');

const shopController = require('../controllers/shop');

const router = express.Router();

router.get('/', shopController.getIndex);

router.get('/products', isAuth, shopController.getProducts);

router.get('/products/:productId', isAuth, shopController.getProductDetail);

router.get('/cart', isAuth, shopController.getCart);

router.post('/cart', isAuth, shopController.postCart);

router.post('/cart/deleteAll', isAuth, shopController.deleteAllCart);

router.post('/cart/:prodId', isAuth, shopController.deleteCart);

router.get('/orders', isAuth, shopController.getOrders);

router.get('/checkout', isAuth, shopController.getCheckout);

router.get('/getinvoice/:invoiceId', isAuth, shopController.getInvoice);

module.exports = router;
