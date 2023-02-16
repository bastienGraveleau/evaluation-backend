const express = require('express');
const stuffRoute = require('./routes/perso');
const cors = require('cors');
const mongo = require('mongodb')
const userRoutes = require('./routes/user');
const path = require('path');

const app = express();
app.use(express.json());
const MongoUtils = require('./mongo');
let mongoClient = new MongoUtils();
let db;
app.use(cors())
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
});
app.use('/api/perso', stuffRoute);
app.use('/api/auth', userRoutes);
app.use('/images', express.static(path.join(__dirname, 'images')));


mongoClient.dbConnect().then(
    (dbconnected) => {

        db = dbconnected
        db.listCollections({name: "object"}).next(async function(err, collinfo) {
            if (!collinfo) {
                await db.createCollection("object", {
                    validator: {
                    $jsonSchema: {
                        bsonType: "object",
                        title: "Object Validation",
                        required: [ "name", "description"],
                        properties: {
                            name: {
                                bsonType: "string",
                                description: "title of the object"
                            },
                            description: {
                                bsonType: "string",
                                description: "description of the object"
                            },
                            
                        }
                    } 
                    } 
                } )

                db.collection("object").insertMany(stuff);
            }
            else {
                console.log("Collection object exist")

            }
        })
        db.listCollections({name: "users"}).next(async function(err, collinfo) {
            if (!collinfo) {
                await db.createCollection("users", {
                    validator: {
                    $jsonSchema: {
                        bsonType: "object",
                        title: "Object Validation",
                        required: [ "password", "email"],
                        properties: {
                            email: {
                                bsonType: "string",
                                description: "title of the object"
                            },
                            password: {
                                bsonType: "string",
                                description: "description of the object"
                            },
                        }
                    }
                    } 
                })
            }
            else {
                console.log("Collection object exist")
            }
        })

    }    
)

module.exports = app;