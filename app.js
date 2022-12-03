
	const { Sequelize, Op, QueryTypes, HSTORE } = require('sequelize');

	// core modules
	const path = require('path');
	const fs = require('fs');
	const url = require('url');
	const crypto = require('crypto');

	// third party modules
	const express = require('express');
	const bodyParser = require('body-parser');
	const cookieParser = require('cookie-parser');
	const session = require('express-session');
	const csrf = require('csurf');
	const bcrypt = require('bcrypt');
	const sequelizeStore = require('connect-session-sequelize')(session.Store);
	const flash = require('connect-flash');
	const multer = require('multer');
	const nodemailer = require('nodemailer');
	const sendgridTransport = require('nodemailer-sendgrid-transport');
	const mongodbSession =  require('connect-mongodb-session')(session);
	const mongoose =  require('mongoose');

	// my imports
	const mainRoot = require('./util/path');
	const adminRoutes = require('./routes/admin');
	const shopRoutes = require('./routes/shop');
	const authRoutes = require('./routes/auth');
	const errorController = require('./controllers/error');
   
	const {mongodbConnect,getDb}=  require('./path/mongoDb');
	const Product =  require('./models/product')



	const multerStorage = multer.diskStorage({
		destination: (req, file, cb) => {
			cb(null, path.join(mainRoot, 'public', 'images'));
		},
		filename: (req, file, cb) => {
			cb(null, `image_${Date.now().toString()}_${file.originalname}`);
		},
	});
	const multerFilter = (req, file, cb) => {
		if (
			file.mimetype == 'image/png' ||
			file.mimetype == 'image/jpg' ||
			file.mimetype == 'image/jpeg'
		)
			cb(null, true);
		else {
			req.fileError = 'error';
			cb(null, false);
		}
	};
	const sessionStorage =  new mongodbSession(
		{uri:'mongodb://0.0.0.0:27017/'
		,databaseName:'shop',
		collection:'userSessions'
	});

	// main code
	const app = express();

	app.set('view engine', 'ejs');
	app.set('views', 'views');
	app.set('trust proxy', 1);
	app.use(bodyParser.urlencoded({ extended: false }));
	app.use(bodyParser.json());
	app.use(express.static(path.join(__dirname, 'public')));
	app.use(express.static(path.join(__dirname, 'public')));
	app.use(express.static(path.join(__dirname, 'public/images')));
	app.use(
		session({
			secret: ['this_is_the_longest_phrase_of_mine__next7'],
			saveUninitialized: false,
			resave: false,
			store:sessionStorage ,
			cookie: {},
		})
	);
	app.use(
		multer({ storage: multerStorage, fileFilter: multerFilter }).single('image')
	);
	app.use(cookieParser());
	app.use(csrf());
	app.use(flash());

	
	app.use(async (req, res, next) => {
	
		// if (req.session.isLoggedIn) {
		// 	res.locals.user = req.session.user;
		// }
		res.locals.isLoggedIn =  true;
		res.locals.authentication =  true;
		req.session.user = res.locals.user={
			username:'natty-7',
			email:'nati7fekadu@gmail.com',
		}
		res.locals.csrfToken = req.csrfToken();
		// res.locals.authentication = req.session?.isLoggedIn;
		next();
	});

	app.use('/admin', adminRoutes);
	app.use(shopRoutes);
	app.use(authRoutes);

	app.use('/500', errorController.get500);
	app.use(errorController.get404);
	app.use((err, req, res, next) => {
		console.log(err);
		res.redirect('/500');
	});

	mongoose.connect('mongodb://0.0.0.0:27017/shop')
	.then(connectd=>{app.listen(8080)})
	.catch(err=>console.log(err))

	
	

	
	