const { Sequelize, Model, Op, DataTypes } = require('sequelize');

const sequelize = require('../path/db');

const CartItem = sequelize.define(
	'cartItem',
	{
		id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
		quantity: DataTypes.INTEGER,
		// price: DataTypes.DOUBLE,
		// title: DataTypes.STRING,
	},
	{ sequelize, modelName: 'cart', timestamps: false }
);

module.exports = CartItem;
