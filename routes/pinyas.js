/**
 * Created by Javier on 01/10/2016.
 */

var express = require('express');
var router = express.Router();
var fs = require('fs');

/* GET home page. */
router.get('/pinyeros', function(req, res, next) {
    var collection = db.collection('pinyeros');

    collection.find({},{"_id" : false , "name": true}).toArray( function (err, data) {
        res.send(data);
    });

});

function roleTranslate(role){
    if(role == "mans") return "Mans Altes";
    if(role == "vent") return "Mans Altes";
    if(role == "crosses") return "Crosses";
    if(role == "contrafort") return "Contraforts";
    if(role == "agulla") return "Agulles";
    if(role == "lateral") return "Laterals";
    if(role == "baix") return "Baixos";
    return role;
}

router.get('/getPinyerosByPos', function(req, res, next) {
    var collection = db.collection('pinyeros');

    collection.find().sort({"height": -1, "armpit": -1, "shoulder": -1}).toArray( function (err, data) {

        var posQuery = JSON.parse(req.query.pos);
        var condition = [];

        for(var i in posQuery){
            condition.push({"key" : ["role"], "value": roleTranslate(posQuery[i]), "isArray" : true});
        }

        var necessary = [
        ];

        var fData = filtrarBy(data, necessary , condition);
        res.send(fData);
    });

});

function setNotReady(array , name){
    for(var i in array){
        if(array[i].name == name){
            array[i].ready = false;
            break;
        }
    }
}

router.get('/generatePinya3', function (req, res, next) {

    var collection = db.collection('pinyeros');

    var baixos = [];

    if(typeof req.query.baixos !== 'undefined') {
        baixos = JSON.parse(req.query.baixos);
    }


    collection.find().sort({"height": -1, "armpit": -1, "shoulder": -1}).toArray( function (err, dbData) {

        var message = [];

        for(var n in dbData ){
            dbData[n]["ready"] = true;
        }

        for(var key in baixos){
            setNotReady(dbData, baixos[key].name);
        }

        var condition = [
            {"key" : ["role"], "value": "Baixos", "isArray" : true},
        ];

        var necessary = [
            {"key" : ["ready"], "value": true, "isArray" : false}
        ];

        var fData = filtrarBy(dbData, necessary , condition);
        for(var i = baixos.length ; i<3; i++){
            setNotReady(dbData, fData[i]["name"]);
            var tempObj =
            {
                "pos" : ["baix", i],
                "name" : fData[i]["name"]
            };

            message.push(tempObj);
        }

        fs.readFile('./files/tres.json', 'utf8', function (err, fileData) {
            if (err) throw err;
            var obj = JSON.parse(fileData);



            for (var key in obj){

                if(obj[key]["pos"] == "mans"){

                    var condition = [
                        {"key" : ["role"], "value": "Mans Altes", "isArray" : true},
                        {"key" : ["role"], "value": "Mans", "isArray" : true}
                    ];

                    var necessary = [
                        {"key" : ["ready"], "value": true, "isArray" : false}
                    ];

                    var fData = filtrarBy(dbData, necessary , condition);

                    if(obj[key]["rengles"] > fData.length){
                        if(obj[key]["cordo"] == 0) res.send(false);
                        else continue;
                    }else{
                        for(var i=0 ; i<obj[key]["rengles"] ; i++ ) {
                            setNotReady(dbData, fData[i]["name"]);

                            var tempObj =
                            {
                                "pos" : [obj[key]["pos"], i , obj[key]["cordo"] ],
                                "name" : fData[i]["name"]
                            };

                            message.push(tempObj);
                        }
                    }

                }

                if(obj[key]["pos"] == "vent"){

                    var condition = [
                        {"key" : ["role"], "value": "Mans Altes", "isArray" : true},
                        {"key" : ["role"], "value": "Mans", "isArray" : true}
                    ];

                    var necessary = [
                        {"key" : ["ready"], "value": true, "isArray" : false}
                    ];

                    var fData = filtrarBy(dbData, necessary , condition);

                    if(obj[key]["rengles"] > fData.length){
                        if(obj[key]["cordo"] == 0) res.send(false);
                        else continue;
                    }else{
                        for(var i=0 ; i<obj[key]["rengles"] ; i++ ) {
                            setNotReady(dbData, fData[i]["name"]);
                            var tempObj =
                            {
                                "pos" : [obj[key]["pos"], i , obj[key]["cordo"] ],
                                "name" : fData[i]["name"]
                            };

                            message.push(tempObj);
                        }
                    }
                }

                if(obj[key]["pos"] == "crosses"){

                    var condition = [
                        {"key" : ["role"], "value": "Crosses", "isArray" : true}
                    ];

                    var necessary = [
                        {"key" : ["ready"], "value": true, "isArray" : false}
                    ];

                    var fData = filtrarBy(dbData, necessary , condition);

                    if(obj[key]["rengles"]*2 > fData.length){
                        if(obj[key]["cordo"] == 0) res.send(false);
                        else continue;
                    }else{
                        for(var i=0 ; i<obj[key]["rengles"] ; i++ ) {
                            setNotReady(dbData, fData[i*2]["name"]);
                            var tempObj =
                            {
                                "pos" : [obj[key]["pos"], i , 'L' ],
                                "name" : fData[i*2]["name"]
                            };

                            message.push(tempObj);
                            setNotReady(dbData, fData[i*2+1]["name"]);
                            var tempObj =
                            {
                                "pos" : [obj[key]["pos"], i , 'R' ],
                                "name" : fData[i*2+1]["name"]
                            };

                            message.push(tempObj);
                        }
                    }
                }

                if(obj[key]["pos"] == "contrafort"){

                    var condition = [
                        {"key" : ["role"], "value": "Contraforts", "isArray" : true}
                    ];

                    var necessary = [
                        {"key" : ["ready"], "value": true, "isArray" : false}
                    ];

                    var fData = filtrarBy(dbData, necessary , condition);

                    if(obj[key]["rengles"] > fData.length){
                        if(obj[key]["cordo"] == 0) res.send(false);
                        else continue;
                    }else{
                        for(var i=0 ; i<obj[key]["rengles"] ; i++ ) {
                            setNotReady(dbData, fData[i]["name"]);
                            var tempObj =
                            {
                                "pos" : [obj[key]["pos"], i ],
                                "name" : fData[i]["name"]
                            };

                            message.push(tempObj);
                        }
                    }

                }

                if(obj[key]["pos"] == "agulla"){

                    var condition = [
                        {"key" : ["role"], "value": "Agulles", "isArray" : true}
                    ];

                    var necessary = [
                        {"key" : ["ready"], "value": true, "isArray" : false}
                    ];

                    var fData = filtrarBy(dbData, necessary , condition);

                    if(obj[key]["rengles"] > fData.length){
                        if(obj[key]["cordo"] == 0) res.send(false);
                        else continue;
                    }else{
                        for(var i=0 ; i<obj[key]["rengles"] ; i++ ) {
                            setNotReady(dbData, fData[i]["name"]);
                            var tempObj =
                            {
                                "pos" : [obj[key]["pos"], i ],
                                "name" : fData[i]["name"]
                            };

                            message.push(tempObj);
                        }
                    }

                }

                if(obj[key]["pos"] == "lateral"){

                    var condition = [
                        {"key" : ["role"], "value": "Laterals", "isArray" : true},
                        {"key" : ["role"], "value": "Mans", "isArray" : true}
                    ];

                    var necessary = [
                        {"key" : ["ready"], "value": true, "isArray" : false}
                    ];

                    var fData = filtrarBy(dbData, necessary , condition);

                    if(obj[key]["rengles"]*2 > fData.length){
                        if(obj[key]["cordo"] == 0) res.send(false);
                        else continue;
                    }else{
                        for(var i=0 ; i<obj[key]["rengles"] ; i++ ) {
                            setNotReady(dbData, fData[i*2]["name"]);
                            var tempObj =
                            {
                                "pos" : [obj[key]["pos"], i, obj[key]["cordo"], 'L' ],
                                "name" : fData[i*2]["name"]
                            };

                            message.push(tempObj);
                            setNotReady(dbData, fData[i*2+1]["name"]);
                            var tempObj =
                            {
                                "pos" : [obj[key]["pos"], i, obj[key]["cordo"], 'R' ],
                                "name" : fData[i*2+1]["name"]
                            };

                            message.push(tempObj);                        }
                    }

                }

            }

            res.send(message);
        });
    });

});

function filterByName(array, name){
    return array.filter(function (person) { return person.name == name });
}

function filtrarBy(data, conjunctivalCondition , disjunctiveCondition ){
    var fData = data.filter(function (obj){
        var bool = false;

        if(disjunctiveCondition.length > 0) {
            for (var cond in disjunctiveCondition) {

                if (disjunctiveCondition[cond]["isArray"] == false) {
                    if (Object.byString(obj, disjunctiveCondition[cond]["key"].join('.')) == disjunctiveCondition[cond]["value"]) {
                        bool = true;
                    }
                } else {
                    var subArray = Object.byString(obj, disjunctiveCondition[cond]["key"].join('.'));
                    for (var key in subArray) {
                        if (subArray[key] == disjunctiveCondition[cond]["value"]) {
                            bool = true;
                        }
                    }
                }
            }

            if (bool == false) return false;
        }


        if(conjunctivalCondition.length > 0) {
            for (var cond in conjunctivalCondition) {

                if (conjunctivalCondition[cond]["isArray"] == false) {
                    if (Object.byString(obj, conjunctivalCondition[cond]["key"].join('.')) != conjunctivalCondition[cond]["value"]) {
                        return false;
                    }
                } else {
                    var subArray = Object.byString(obj, conjunctivalCondition[cond]["key"].join('.'));
                    for (var key in subArray) {
                        if (subArray[key] != conjunctivalCondition[cond]["value"]) {
                            return false;
                        }
                    }
                }
            }
        }

        return true;
    });

    return fData;
}

///// DEPRECATED //////
/*function filtrarMansA(obj) {
    var bool = false;
    for(var key in obj["role"]){
        if(obj["role"][key] == "Mans Altes") {
            bool = true;
        }
    }

    return bool;
}

function filtrarMans(obj) {
    var bool = false;
    for(var key in obj["role"]){
        if(obj["role"][key] == "Mans") {
            bool = true;
        }
    }

    return bool;
}

function filtrarCrosses(obj) {
    var bool = false;
    for(var key in obj["role"]){
        if(obj["role"][key] == "Crosses") {
            bool = true;
        }
    }

    return bool;
}

function filtrarContraforts(obj) {
    var bool = false;
    for(var key in obj["role"]){
        if(obj["role"][key] == "Contraforts") {
            bool = true;
        }
    }

    return bool;
}

function filtrarLaterals(obj) {
    var bool = false;
    for(var key in obj["role"]){
        if(obj["role"][key] == "Laterals") {
            bool = true;
        }
    }

    return bool;
}

function filtrarBaixos(obj) {
    var bool = false;
    for(var key in obj["role"]){
        if(obj["role"][key] == "Baixos") {
            bool = true;
        }
    }

    return bool;
}

function filtrarAgulles(obj) {
    var bool = false;
    for(var key in obj["role"]){
        if(obj["role"][key] == "Agulles") {
            bool = true;
        }
    }

    return bool;
}*/

Object.byString = function(o, s) {
    s = s.replace(/\[(\w+)\]/g, '.$1'); // convert indexes to properties
    s = s.replace(/^\./, '');           // strip a leading dot
    var a = s.split('.');
    for (var i = 0, n = a.length; i < n; ++i) {
        var k = a[i];
        if (k in o) {
            o = o[k];
        } else {
            return;
        }
    }
    return o;
}

module.exports = router;