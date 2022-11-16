const { Sequelize, Model, Op, DataTypes, DATE } = require('sequelize');
const sequelize = require('../path/db');
class User extends Model {}
User.init(
	{
		id: {
			type: DataTypes.INTEGER,
			autoIncrement: true,
			primaryKey: true,
		},
		username: DataTypes.STRING,
		email: DataTypes.STRING,
		password: DataTypes.STRING,
		resetToken: DataTypes.STRING,
		resetTokenExpiration: DataTypes.DATE,
	},
	{ sequelize, modelName: 'user', timestamps: false }
);
module.exports = User;
