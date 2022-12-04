module.exports = (req, res, next) => {
	// const isLoggedIn = req.session.isLoggedIn;
	// if (!isLoggedIn) return res.redirect('/login');
	next();
};
