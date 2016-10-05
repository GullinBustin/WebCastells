/**
 * Created by Javier on 01/10/2016.
 */

var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/pinyeros', function(req, res, next) {
    var collection = db.collection('pinyeros');

    collection.find({},{"_id" : false , "name": true}).toArray( function (err, data) {
        res.send(data);
    });

});

module.exports = router;