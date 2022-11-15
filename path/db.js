const { Sequelize, QueryTypes } = require('sequelize');
const sequelize = new Sequelize('sqlize', 'root', 'next@7', {
	dialect: 'mysql',
	host: 'localhost',
	logging: false,
});
module.exports = sequelize;
