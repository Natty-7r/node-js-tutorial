const express = require('express');
const router = express.Router();
const { check, body: validator } = require('express-validator');

const authController = require('../controllers/authController');

const signupValidator = function () {
	return [
		validator('email').isEmail().withMessage('Please Enter a Valid Email !'),
		validator('password')
			.isLength({ min: 8 })
			.withMessage('password must be at least 8 charaters')
			.isStrongPassword({
				minLowercase: 0,
				minSymbols: 1,
				minUppercase: 0,
				minNumbers: 1,
				minLength: 1,
			})
			.withMessage('password must be contain letter ,numbers and symbols! '),
		validator('confirmPassword')
			.trim()
			.custom((value, { req }) => {
				if (value !== req.body.password.trim())
					throw new Error('Password mismtach!');
				return true;
			}),
	];
};

const resetValidator = function () {
	return [
		validator('email').isEmail().withMessage('Please Enter a valid Email!'),
	];
};
const resettingValidator = function () {
	return [
		validator('password')
			.isLength({ min: 8 })
			.withMessage('password must be at least 8 charaters')
			.isStrongPassword({
				minLowercase: 0,
				minSymbols: 1,
				minUppercase: 0,
				minNumbers: 1,
				minLength: 1,
			})
			.withMessage('password must be contain letter ,numbers and symbols! '),
		validator('confirmPassword')
			.trim()
			.custom((value, { req }) => {
				if (value !== req.body.password.trim())
					throw new Error('Password mismtach!');
				return true;
			}),
	];
};

router.get('/login', authController.getLogin);
router.post('/login', authController.postLogin);

router.get('/logout', authController.logout);

router.get('/signup', authController.getSignup);
router.post('/signup', signupValidator(), authController.postSignup);

router.get('/reset', authController.getReset);
router.get('/reset/:resetToken', authController.getNewPassword);

router.post('/reset', resetValidator(), authController.postReset);
router.post('/resetDone', resettingValidator(), authController.resetPassword);
module.exports = router;
