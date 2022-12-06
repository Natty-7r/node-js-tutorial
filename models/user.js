const mongoose =  require('mongoose');
const Product = require('./product');
const Schema =  mongoose.Schema;


const userSchema =  new Schema({
	username:{type:String,requred:true},
	email:{
		type:String,
		lowercase:true,
		required:true,
	},
	password:{type:String,required:true,},
	cart:{
		items:[{productId:{ type:Schema.Types.ObjectId, ref:'Product' },title:String,qty:Number,price:Number}]
	},
	resetToken: String,
	resetTokenExpiration: Date


},{methods:{
	async deleteCart(product){
		
	let productIndex  =  this.cart.items.findIndex(productItem=> 
		 product._id.toString()==productItem.productId.toString()
	);
	if(this.cart.items[productIndex].qty>1)
		this.cart.items[productIndex].qty--;	
	else
		this.cart.items.splice(productIndex,1);
	
	await this.save();
	}
}})
userSchema.methods.addToCart =async  function (product){
	let cartProduct;
	let productIndex  =  this.cart.items.findIndex(productItem=> 
		product._id.toString()==productItem.productId.toString()
		);
	if(productIndex!=-1){
      this.cart.items[productIndex].qty++;
	}
	else{
		cartProduct ={
		productId:product._id,
		title:product.title,
		price:product.price,
		qty:1,
	};
	this.cart.items.push(cartProduct);
	}
	return  await this.save();
}
userSchema.methods.getCart=  async function(){
	let cart =  this.cart,totalPrice = 0;
	this.cart.items.forEach(item=> totalPrice+=(+item.qty*+item.price));
	cart.totalPrice =  totalPrice;
	return cart;
}

module.exports =  mongoose.model('User',userSchema);



