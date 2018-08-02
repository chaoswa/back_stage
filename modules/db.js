//连接数据库，数据库操作，安装mongodb
// 1.启动mongodb服务，mongod --dbpath F:\mongodb;
// 2.连接mongodb数据库，mongo
var MongoClient=require('mongodb').MongoClient
const DbUrl="mongodb://localhost:27017"
const dbName = 'productmanage';
var ObjectID=require('mongodb').ObjectID

function _connectDb(callback){
    MongoClient.connect(DbUrl,{useNewUrlParser:true},function(err,client){/*连接数据库*/
        if(err){
            console.log(err);
            return;
        }
        
        //增加 修改 删除
        callback(client)
    })
}

export const ObjectID=ObjectID


//数据库查找
export function DbFind(collectionName,json,callback){
    _connectDb(function(client){

        const db=client.db(dbName)
        
        var result=db.collection(collectionName).find(json);

        result.toArray(function(error,data){
            client.close();
            callback(error,data)
        })
    })
}

//增加数据
export function DbInsert(collectionName,json,callback){
    _connectDb(function(client){

        const db=client.db(dbName)

        db.collection(collectionName).insertOne(json,function(error,data){
            client.close();
            callback(error,data)
        });
        
    })
}

//修改数据
export function DbUpdata(collectionName,json1,josn2,callback){
    _connectDb(function(client){

        const db=client.db(dbName)

        db.collection(collectionName).updataOne(json1,{$set:josn2},function(error,data){
            client.close();
            callback(error,data)
        });

    })
}

//删除数据
export function DbDeleteOne(collectionName,json,callback){
    _connectDb(function(client){

        const db=client.db(dbName)

        db.collection(collectionName).deleteOne(json,function(error,data){
            client.close();
            callback(error,data)
        });

    })
}