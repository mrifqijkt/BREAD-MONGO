var express = require('express');
const ObjectID = require("mongodb").ObjectId;
var router = express.Router();

module.exports = function (db) {

  const collection = db.collection('users')

  router.get('/', async function (req, res, next) {

    const { page = 1, id, string, integer, float, startdate, enddate, boolean, sortBy = '_id', sortMode = 'asc' } = req.query
    const params = {}

    const sortParams = {}
    sortParams[sortBy] = sortMode == 'asc' ? 1 : -1

    if (id) {
      params['id'] = parseInt(id)

    }

    if (string) {
      params['string'] = new RegExp(string, 'i')

    }

    if (integer) {
      params['integer'] = parseInt(integer)

    }

    if (float) {
      params['float'] = parseFloat(float)

    }

    if (startdate && enddate) {
      params['date'] = { $gte: new Date(startdate), $lte: new Date(enddate) }

    } else if (startdate) {
      params['date'] = { $gte: new Date(startdate) }
    } else if (enddate) {
      params['date'] = { $lte: new Date(enddate) }
    }

    if (boolean) {
      params['boolean'] = boolean === 'true'

    }

    const limit = 3

    const offset = (page - 1) * limit

    const total = await collection.find(params).count();

    const pages = Math.ceil(total / limit);

    const users = await collection.find(params).sort(sortParams).limit(limit).skip(offset).toArray();
    res.json({ users, page: parseInt(page), pages, offset })
  });

  router.post('/', async function (req, res, next) {
    console.log(req.body)
    const user = await collection.insertOne({ id: parseInt(req.body.id), string: req.body.string, integer: parseInt(req.body.integer), float: parseFloat(req.body.float), date: new Date(req.body.date), boolean: JSON.parse(req.body.boolean) });
    res.json(user)
  });

  router.delete("/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const result = await collection.deleteOne({ _id: new ObjectID(id) });
      res.json(result);
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: "Error deleting data" });
    }
  });

  return router;
}