const mongodb =  require("mongodb");
const Mongoclient =  mongodb.MongoClient;

let _db;
const mongodbConnect=(cb)=>{
Mongoclient.connect('mongodb://0.0.0.0:27017/').
then(connection=>{
_db=connection.db('shop');
cb(connection);
}).
catch(err=>{
    console.log(err); throw new Error(err)
})
}

const getDb = ()=>{
    if(_db) return _db;
}

exports.mongodbConnect =  mongodbConnect;
exports.getDb =  getDb;