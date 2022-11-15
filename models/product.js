const { Sequelize, DataTypes, Model, Op } = require('sequelize');
const sequelize = require('../path/db');

const Product = sequelize.define(
	'product',
	{
		id: {
			type: Sequelize.INTEGER,
			autoIncrement: true,
			allowNull: false,
			primaryKey: true,
		},
		title: { type: DataTypes.STRING },
		price: DataTypes.DOUBLE,
		description: { type: DataTypes.STRING, allowNull: false },
		imgUrl: { type: DataTypes.STRING, allowNull: false },
		owner: { type: DataTypes.STRING, allowNull: false },
	},
	{
		timestamps: false,
	}
);

module.exports = Product;
