const getDb =  require('../path/mongoDb').getDb;
const mongodb =  require('mongodb');

class Product {
	constructor(title,imageUrl, price,description,userId,id){
		this.title =  title;
		this.imageUrl  = imageUrl;
		this.price =  price;
		this.description =  description;
		this.userId =  userId;
		this._id = new mongodb.ObjectId(id);
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
	console.log(productId)
	const ProductCollection =  getDb().collection('products');
	return  await ProductCollection.find({_id:new mongodb.ObjectId(productId)}).next(); 
   }
}
module.exports = Product;
