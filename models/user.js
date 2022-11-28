const getDb =  require('../path/mongoDb').getDb;
const bcrypt =  require('bcrypt');

class User{
	 constructor(email,password){
			this.email =  email;
			this.password  = password;	
			this.username = email.split('@')[0];
	}
	 save(){
		const UserCollection =  getDb().collection('users');
		return   UserCollection.insertOne(this);
	}
	static async findUser(email){
		const UserCollection =  getDb().collection('users');
		return UserCollection.find({email}).next();
	}

}
module.exports =  User;
