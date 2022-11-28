const getDb =  require('../path/mongoDb').getDb;
const mongodb =  require('mongodb');
const { dirname } = require('path');
const path =  require('path');
const fs =  require('fs');




// helper functions 


class Product {
	constructor(title, price,description,imageUrl,userId,prodId){
		this.title =  title;
		this.imageUrl  = imageUrl;
		this.price =  price;
		this.description =  description;
		this.userId =  userId;
		this._id = prodId;
	}
	
    save(){
		const ProductCollection =  getDb().collection('products');
		let saveOperation;
		if(this._id){
         saveOperation =   ProductCollection.updateOne({_id:this._id},{$set:this});
		}
		else{
		    saveOperation  = 	ProductCollection.insertOne(this)
		}
		return saveOperation.then(result =>{
			// console.log(result)
		});
	}
   static async findAll(){
	const ProductCollection =  getDb().collection('products');
	return  await ProductCollection.find().toArray(); 
   }
   static async findUserProducts(userId){
	const ProductCollection =  getDb().collection('products');
	return await ProductCollection.find({userId:userId.toString()}).toArray(); 
   }
   static async  findById(productId){
	const ProductCollection =  getDb().collection('products');
	return  await ProductCollection.find({_id:new mongodb.ObjectId(productId)}).next(); 
   }
   static async deleteProduct(prodId){
	const ProductCollection =  getDb().collection('products');
	await ProductCollection.deleteOne({_id:new mongodb.ObjectId(prodId)});
   }
}
module.exports = Product;
