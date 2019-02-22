// db库
var MongoDb = require("mongodb");

var MongoClient = MongoDb.MongoClient;

var ObjectID = MongoDb.ObjectID;

var Config = require("./config.js");

class Db {
    static getInstance() {
        if(!Db.instance) {
            Db.instance = new Db();
        }
        return Db.instance;
    }
    constructor() {
        this.dbClient = "";
        this.connect();
    }
    connect() {
        var self = this;
        return new Promise((resolve, reject)=>{
            if(!self.dbClient) {
                 MongoClient.connect(Config.dbUrl, (err, client)=>{
                    if(err){
                        reject(err);
                    } else {
                        var db = client.db(Config.dbName);
                        self.dbClient = db;
                        resolve(self.dbClient);
                    }
                })
            } else {
                resolve(self.dbClient);
            }
           
        
        })
        
    }
    find(collectionName,json) {
        return new Promise((resolve, reject)=>{
            this.connect().then((db)=>{
                var result = db.collection(collectionName).find(json);
                result.toArray((err, docs)=>{
                    if(err) {
                        reject(err);
                        return;
                    } else {
                        resolve(docs)
                    }
                })
            })
        })
        
    }
    insert(collectionName, json) {
        return new Promise((resolve, reject)=>{
            this.connect().then((db)=>{
                db.collection(collectionName).insertOne(json, (err, result)=>{
                    if(err) {
                        reject(err);
                        return;
                    } else {
                        resolve(result);
                    }

                })
            })
        })
    }
    update(collectionName, json1, json2) {
        return new Promise((resolve, reject)=>{
            this.connect().then((db)=>{
                db.collection(collectionName).updateOne(json1, {
                    $set: json2
                }, (err, result)=>{
                    if(err) {
                        reject(err);
                    } else {
                        resolve(result);
                    }
                })
            })
        })
    }
    remove(collectionName, json) {
        return new Promise((resolve, reject)=>{
            this.connect().then((db)=>{
                db.collection(collectionName).removeOne(json, (err, result)=>{
                    if(err) {
                        reject(err);
                    } else {
                        resolve(result);
                    }
                })
            })
        })
    }
    getObjectId(id) {
        return new ObjectID(id);
    }
}
module.exports = Db.getInstance();