var express = require('express');
var router = express.Router();

module.exports = function (db) {

  const collection = db.collection('users')

  router.get('/', async function (req, res, next) {

    const { page = 1, id, string, integer, float, stardate, enddate, boolean, sortBy = '_id', sortMode = 'asc' } = req.query
    const params = {}

    const sortParams = {}
    sortParams[sortBy] = sortMode == 'asc' ? 1 : -1

    if (id) {
      params['id'] = id

    }

    if (string) {
      params['string'] = new RegExp(string, 'i')

    }

    if (integer) {
      params['integer'] = integer

    }

    if (float) {
      params['float'] = float

    }

    if (stardate && enddate) {
      params['date'] = { $gte: new Date(stardate), $lte: new Date(enddate) }

    } else if (stardate) {
      params['date'] = { $gte: new Date(stardate) }
    } else if (enddate) {
      params['date'] = { $lte: new Date(enddate) }
    }

    if (boolean) {
      params['boolean'] = boolean

    }

    const limit = 3

    const offset = (page - 1) * limit

    const total = await collection.find(params).count();

    const pages = Math.ceil(total / limit);

    console.log(params)

    const users = await collection.find(params).sort(sortParams).limit(limit).skip(offset).toArray();
    res.json({ users, page: parseInt(page), pages })
  });

  router.post('/', async function (req, res, next) {
    const user = await collection.insertOne({ id: parseInt(req.body.id), string: req.body.string, integer: parseInt(req.body.integer), float: parseFloat(req.body.float), date: new Date(req.body.date), boolean: JSON.parse(req.body.boolean) });
    res.json(user)
  });

  return router;
}