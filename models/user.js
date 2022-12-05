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
	}


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





// const getDb =  require('../path/mongoDb').getDb;
// const bcrypt =  require('bcrypt');
// const mongoDb =  require('mongodb');
// const ObjectId =  mongoDb.ObjectId;

// class User{
// 	 constructor(email,password,username,cart,id){
// 		    this._id = id ? id :null; 
// 			this.email =  email;
// 			this.password  = password;	
// 			this.username = username ? username:  email.split('@')[0];
// 			this.cart = cart? cart : {items:[]};
// 	}
// 	 save(){
// 		const UserCollection =  getDb().collection('users');
// 		return   UserCollection.insertOne(this);
// 	}
// 	static async findUser(email){
// 		const UserCollection =  getDb().collection('users');
// 		return  await  UserCollection.find({email}).next();
// 	}
// 	addToCart(product){
// 		const UserCollection =  getDb().collection('users');
// 		const productIndex =  this.cart.items.findIndex((cp)=>{
// 			return cp.id ==  product._id.toString();
// 		});

		
// 		let updatedCarts = this.cart.items;
// 		if(productIndex!=-1){
// 			 this.cart.items[productIndex].qty=this.cart.items[productIndex].qty+1;
// 			 updatedCarts =  this.cart.items ;
// 		}else{
// 			updatedCarts.push({
// 				id:product._id.toString(),
// 				qty: 1,
// 				price: product.price ,
// 				title:product.title,
// 			})

// 		}
// 	UserCollection.updateOne({_id: new ObjectId(this._id)},{$set:{cart:{items: updatedCarts}}})
	   
// 	}
// 	getCart(){
// 		let totalPrice = 0 ;
// 		const cartProducts =  this.cart.items;
// 		if(cartProducts.length ==0) totalPrice = null;
// 		if(cartProducts.length>0){
// 			cartProducts.forEach(product => {
// 				totalPrice += +product.price * + product.qty;
// 			});
// 		}
// 		return   {products:this.cart.items,totalPrice} ;

// 	}
// 	deleteCart(prodId){
// 		const UserCollection =  getDb().collection('users');	
// 		const productIndex =  this.cart.items.findIndex((cp)=>{
// 			return cp.id ==  prodId;
// 		});

// 		const cartItems =  this.cart.items;
// 		if(+cartItems[productIndex].qty > 1){
// 			cartItems[productIndex].qty =  cartItems[productIndex].qty-1;
// 		}		
// 		else if(+cartItems[productIndex].qty == 1){
// 			cartItems.splice(productIndex,1)
// 		}
// 		UserCollection.updateOne({_id: new ObjectId(this._id)},{$set:{cart:{items: cartItems}}})
			
// 	}

// }
// module.exports =  User;
