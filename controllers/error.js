exports.get404 = (req, res, next) => {
	const isLoggedIn = req.session.isLoggedIn;
	res.status(404).render('404', {
		pageTitle: 'Page Not Found',
		path: '/404',
		user: req.session.user,
		authentication: isLoggedIn,
	});
};
exports.get500 = (req, res, next) => {
	const isLoggedIn = req.session.isLoggedIn;
	res.status(500).render('500', {
		pageTitle: 'server Error ',
		path: '/500',
		user: req.session.user,
		authentication: isLoggedIn,
	});
};
