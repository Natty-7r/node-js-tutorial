const crypto = require('crypto');
const bcrytp = require('bcrypt');
const User = require('../models/user');
const { Op } = require('sequelize');
const { validationResult } = require('express-validator');

exports.getLogin = (req, res, next) => {
	res.render('../views/auth/login.ejs', {
		pageTitle: 'LognIn',
		path: '/login',
		logInError: req.flash('logInError')[0],
	});
};
exports.postLogin = (req, res, next) => {
	const isLoggedIn = false;
	const { email, password } = req.body;

	User.findOne({ where: { email } }).then((user) => {
		if (!user) {
			req.flash('logInError', 'unrecognized Email !');
			return res.redirect('/login');
		}
		if (user) {
			bcrytp.compare(password, user.password).then((areEqual) => {
				if (!areEqual) {
					req.flash('logInError', 'invalid   Password !');
					return res.redirect('/login');
				}
				return (() => {
					req.session.user = user;
					req.session.isLoggedIn = true;
					res.redirect('/');
				})();
			});
		}
	});
};

exports.logout = (req, res, next) => {
	req.session.destroy((err) => {
		if (err) console.log(err);
		res.redirect('/');
	});
};

exports.getSignup = (req, res, next) => {
	res.render('../views/auth/signup', {
		pageTitle: 'Sign up',
		path: '/signup',
		email: '',
		authentication: false,
		signupError: req.flash('signupError'),
	});
};
exports.postSignup = (req, res, next) => {
	let { email, password, confirmPassword } = req.body;
	const validationError = validationResult(req);
	if (!validationError.isEmpty()) {
		req.flash('signupError', validationError.array()[0].msg);
		return res.status(422).redirect('/signup');
	}
	User.findOne({ where: { email } }).then((user) => {
		if (user) {
			req.flash('signupError', 'Email already exits try another one !');
			return res.status(422).redirect('/signup');
		}
		if (!user) {
			bcrytp.hash(password, 12).then((hashPassword) => {
				User.create({
					// id: `id_${Date.now().toString()}`,
					email,
					password: hashPassword,
					username: email.split('@')[0],
				})
					.then((user) => {
						return User.findOne({ where: { email: user.email } });
					})
					.then((user) => {
						req.session.user = user;
						req.session.isLoggedIn = true;
						user.createCart({ id: 333 + user.id });
						res.redirect('/');
					});
			});
		}
	});
};

exports.getReset = (req, res, next) => {
	res.render('../views/auth/reset.ejs', {
		pageTitle: 'Reset',
		path: '/reset',
		logInError: req.flash('resetError'),
	});
};
exports.postReset = (req, res, next) => {
	let resetToken, resetTokenExpiration;
	const validationError = validationResult(req);
	if (!validationError.isEmpty()) {
		req.flash('resetError', 'invlaid email !');
		return res.status(422).redirect('/reset');
	}
	User.findOne({ where: { email: req.body.email } }).then((user) => {
		if (!user) {
			req.flash('resetError', 'unrecognized Email !');
			return res.status(422).redirect('/reset');
		}

		crypto.randomBytes(32, (err, buffer) => {
			if (err) {
				req.flash('resetError', 'resetting failed try again ');
				return redirect('/reset');
			}
			resetToken = buffer.toString('hex');
			resetTokenExpiration = Date.now() + 1000 * 60;
			user.resetToken = resetToken;
			user.resetTokenExpiration = resetTokenExpiration;
			user.save().then((result) => {
				res.render('../views/auth/email.ejs', {
					pageTitle: 'Reset',
					path: '/login',
					logInError: '',
					resetToken,
				});
			});
		});
	});
};
exports.getNewPassword = (req, res, next) => {
	const resetToken = req.params.resetToken;
	User.findOne({
		where: {
			resetToken: resetToken,
			resetTokenExpiration: { [Op.gte]: Date.now() },
		},
	}).then((user) => {
		if (!user)
			return res.render('../views/auth/reset.ejs', {
				pageTitle: 'Reset',
				path: '/reset',
				logInError: 'resetting failed . try Again!',
			});
		return res.render('../views/auth/resetDone.ejs', {
			pageTitle: 'Reset',
			path: '/reset',
			logInError: '',
			username: user.username,
		});
	});
};
exports.resetPassword = (req, res, next) => {
	try {
		const { password, confirmPassword, username } = req.body;
		const validationError = validationResult(req);
		if (!validationError.isEmpty()) {
			return res.render('../views/auth/resetDone.ejs', {
				pageTitle: 'Reset',
				path: '/reset',
				logInError: validationError.array()[0].msg,
				username,
			});
		}

		let userFound;
		User.findOne({ where: { username } })
			.then((user) => {
				userFound = user;
				return bcrytp.hash(password, 12);
			})
			.then((hashPassword) => {
				userFound.password = hashPassword;
				userFound.resetToken = null;
				userFound.resetTokenExpiration = null;
				return userFound.save();
			})
			.then((result) => {
				res.redirect('/login');
			})
			.catch((err) => {
				throw new Error(err);
			});
	} catch (err) {
		const error = new Error(console.error());
		error.statusCode = 500;
		res.redirect('/500');
	}
};
