const mongoose =  require('mongoose')
const Schema =  mongoose.Schema;
const productShema =  new Schema({
	title: {
		type: String ,
		required: true,
	},
	price: {
		type: String ,
		required: true,
	},
	description: {
		type: String ,
		required: true,
	},
	imageUrl: {
		type: String ,
		required: true,
	}
})

module.exports  =  mongoose.model('Product',productShema);
