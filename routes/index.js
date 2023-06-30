var express = require('express');
const { Collection } = require('mongodb');
var router = express.Router();

module.exports = function(db){

// Jquery
router.get('/', function(req, res, next) {
  res.render('indexJquery');
});

// Vanilla
router.get('/v', function(req, res, next) {
  res.render('indexVanilla');
});

return router;
}