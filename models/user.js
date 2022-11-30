const getDb =  require('../path/mongoDb').getDb;
const bcrypt =  require('bcrypt');
const mongoDb =  require('mongodb');
const ObjectId =  mongoDb.ObjectId;

class User{
	 constructor(email,password,username,cart,id){
		    this._id = id ? id :null; 
			this.email =  email;
			this.password  = password;	
			this.username = username ? username:  email.split('@')[0];
			this.cart = cart? cart : {items:[]};
	}
	 save(){
		const UserCollection =  getDb().collection('users');
		return   UserCollection.insertOne(this);
	}
	static async findUser(email){
		const UserCollection =  getDb().collection('users');
		return  await  UserCollection.find({email}).next();
	}
	addToCart(product){
		const UserCollection =  getDb().collection('users');
		const productIndex =  this.cart.items.findIndex((cp)=>{
			return cp.id ==  product._id.toString();
		});

		
		let updatedCarts = this.cart.items;
		if(productIndex!=-1){
			 this.cart.items[productIndex].qty=this.cart.items[productIndex].qty+1;
			 updatedCarts =  this.cart.items ;
		}else{
			updatedCarts.push({
				id:product._id.toString(),
				qty: 1,
				price: product.price ,
				title:product.title,
			})

		}
	UserCollection.updateOne({_id: new ObjectId(this._id)},{$set:{cart:{items: updatedCarts}}})
	   
	}
	getCart(){
		let totalPrice ;
		const cartProducts =  this.cart.items;
		return   this.cart.items ;

	}

}
module.exports =  User;
