/**
 * Created by Javier on 31/07/2017.
 */

var express = require('express');
var router = express.Router();
var fs = require("fs");
var path = require('path');

/* GET users listing. */
router.get('/tres.json', function(req, res, next) {

    fs.readFile("public/images/tres.json", 'utf8',function (err,data) {
        if (err) {
            console.log(err);
            process.exit(1);
        }
        //console.log(JSON.parse(data));
        res.send({file:JSON.parse(data)});
    });

});

module.exports = router;

