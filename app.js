const main = function () {
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

	// my imports
	const mainRoot = require('./util/path');
	const adminRoutes = require('./routes/admin');
	const shopRoutes = require('./routes/shop');
	const authRoutes = require('./routes/auth');
	const errorController = require('./controllers/error');

	const sequelize = require('./path/db');
	const Cart = require('./models/cart');
	const CartItem = require('./models/cartItem');
	const Product = require('./models/product');
	const User = require('./models/user');
	// function to use
	const transporter = nodemailer.createTransport(
		sendgridTransport({
			auth: {
				api_key:
					'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',
			},
		})
	);
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
			store: new sequelizeStore({ db: sequelize }),
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
		if (req.session.isLoggedIn) {
			const userSaved = req.session.user;
			res.locals.user = userSaved;
			const user = await User.findOne({ where: { email: userSaved.email } });
			if (user.password === userSaved.password) req.user = user;
		}
		res.locals.csrfToken = req.csrfToken();
		res.locals.authentication = req.session?.isLoggedIn;
		next();
	});
	app.use('/admin', adminRoutes);
	app.use(shopRoutes);
	app.use(authRoutes);

	app.use(errorController.get404);

	Product.belongsTo(User, { constraints: true, onDelete: 'CASCADE' });
	User.hasMany(Product);

	User.hasOne(Cart);
	Cart.belongsTo(User, { onDelete: 'CASCADE', constraints: true });

	Cart.belongsToMany(Product, { through: CartItem });
	Product.belongsToMany(Cart, { through: CartItem });

	sequelize
		// .sync({ force: true })
		.sync()
		.then(() => {})
		.catch((err) => console.log(err));

	app.listen(8080);
	// -------------------

	const sender = async () => {
		const info = await transporter.sendMail({
			to: 'nati7fekadu@gmail.com',
			from: 'forprojectnatty@gmail.com',
			subject: 'email trial',
			html: '<h1>email sent</h1>',
		});
		console.log(info);
	};
	// sender();
};
main();
