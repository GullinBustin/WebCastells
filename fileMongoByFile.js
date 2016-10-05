"use strict";


var fs = require('fs');
var mongo = require('mongodb');
var MongoClient = mongo.MongoClient;

var url = 'mongodb://localhost:27017/WebCastells';


var db;

MongoClient.connect(url, function(err, tdb) {
    db = tdb;

    fs.readFile('./files/Alçades Colla.csv', 'utf8', function (err, data) {
        if (err) throw err;

        var fileLines = data.split("\r\n ");

        var leyend = fileLines[0].split(";");

        var users = [];

        for(var i=1 ; i< fileLines.length; i++){
            var temp = fileLines[i].trim().split(";");
            var json = {};
            for(var j in leyend){
                if(leyend[j] == "role"){
                    json[leyend[j]] = temp[j].trim().split(",");
                }else {
                    json[leyend[j]] = temp[j].trim();
                }
            }
            users.push(json);
        }

        console.log(users);

        var collection = db.collection('pinyeros');

        collection.insertMany(users);

    });

});





