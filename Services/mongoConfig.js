/**
 * Created by Javier on 27/09/2016.
 */
"use strict";

var mongo = require('mongodb');
var MongoClient = mongo.MongoClient;

var mongoConfig = function () {

    var url = 'mongodb://localhost:27017/WebCastells';

    MongoClient.connect(url, function (err, db) {
        console.log("Connected correctly to MongoDB server");
        global.db = db;
    });

};

module.exports = mongoConfig;