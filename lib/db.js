//TODO
const {MongoClient, ObjectId} = require('mongodb');
const {config} = require('../config');

class DB {
    constructor(){
        this.client = new MongoClient(config.mongodb, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        this.dbName = config.dbName; 
    }

    connect(){
        DB.connection = new Promise((resolve, reject) => {
            this.client.connect(err => {
                if (err){
                    reject(err);
                }

                console.log('Sucessfully conect to MongoDB');
                resolve(this.client.db(this.dbName));
            })
        });

        return DB.connection;
    }
        
    async getAll(collection){
        const db = await this.connect();

        return db
        .collection(collection)
        .find({})
        .toArray();
    }

    async getAllByTag(collection, query){
        const TagArray = query.split(',');
        const db = await this.connect();

        return db
        .collection(collection)
        .find({ tags: {$all: TagArray} })
        .toArray();
    }

    async get(collection, id) {
        const db = await this.connect();

        return db
        .collection(collection)
        .findOne({_id: ObjectId(id)});
    }

    async create(collection, data){
        const db = await this.connect();

        const result = await db
            .collection(collection)
            .insertOne(data);

        return result.insertId;
    }

    async update(collection, id, data){
        const db = await this.connect();
        console.log(id);
        
        const result = await db
            .collection(collection)
            .updateOne({"_id": ObjectId(id)}, {$set: {data}}, {upsert: true});
        
        return result.insertId;
    }

    async delete(collection, id){

    }
}

module.exports = DB;