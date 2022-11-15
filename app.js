const main = function () {
	const { Sequelize, Op, QueryTypes, HSTORE } = require('sequelize');
	const path = require('path');
	const url = require('url');
	const crypto = require('crypto');
	const express = require('express');
	const bodyParser = require('body-parser');
	const cookieParser = require('cookie-parser');
	const session = require('express-session');
	const csrf = require('csurf');
	const bcrypt = require('bcrypt');
	const nodemailer = require('nodemailer');

	const adminRoutes = require('./routes/admin');
	const shopRoutes = require('./routes/shop');
	const authRoutes = require('./routes/auth');
	const errorController = require('./controllers/error');
	const sequelizeStore = require('connect-session-sequelize')(session.Store);

	const sequelize = require('./path/db');
	const Cart = require('./models/cart');
	const CartItem = require('./models/cartItem');
	const Product = require('./models/product');
	const User = require('./models/user');
	const fs = require('fs');

	const app = express();

	app.set('view engine', 'ejs');
	app.set('views', 'views');
	app.set('trust proxy', 1);

	app.use(bodyParser.urlencoded({ extended: false }));
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
	app.use(cookieParser());
	// app.use(csrf());

	app.use(async (req, res, next) => {
		if (req.session.isLoggedIn) {
			const userSaved = req.session.user;

			res.locals.user = userSaved;
			const user = await User.findOne({ where: { email: userSaved.email } });
			if (user.password === userSaved.password) req.user = user;
		}
		res.locals.csrfToken = 'kk';
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
};
main();
