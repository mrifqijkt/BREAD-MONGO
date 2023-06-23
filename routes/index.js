var express = require('express');
const { Collection } = require('mongodb');
var router = express.Router();

module.exports = function(db){

router.get('/', function(req, res, next) {
  res.render('indexJquery');
});

return router;
}