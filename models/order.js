const mongoose =  require('mongoose');
const Schema =  mongoose.Schema;

const orderSchema =  new Schema({
	products:[
		{productId:{ type:Schema.Types.ObjectId, ref:'Product' },
		title:String,
		qty:Number,
		price:Number
	},
		
	]
	,user:{
		userId:{
			type:Schema.Types.ObjectId,
			ref:'User'
		},
		username: String,
	},
	date:{
		type:Date,
		default:Date.now()
		
	}
}
,{
	// methods:{
	// 	addOrder(order)
	// }
})
module.exports =  mongoose.model('Order',orderSchema);