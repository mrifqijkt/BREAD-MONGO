var express = require('express');
const { ObjectId } = require('mongodb');
var router = express.Router();

module.exports = function (db) {

  const collection = db.collection('users')

  router.get('/', async function (req, res, next) {

    const { page = 1, number, checkboxId, checkboxString, checkboxInteger, checkboxFloat, checkboxDate, checkboxBoolean, string, integer, float, startDate, endDate, boolean, sortBy = 'number', sortMode = 'asc' } = req.query
    const params = {}

    const sortParams = {}
    sortParams[sortBy] = sortMode == 'asc' ? 1 : -1

    if (number && checkboxId === 'true' || checkboxId === 'on') {
      params['number'] = parseInt(number)
    }

    if (string && checkboxString === 'true' || checkboxString === 'on') {
      params['string'] = new RegExp(string, 'i')
    }

    if (integer && checkboxInteger === 'true' || checkboxInteger === 'on') {
      params['integer'] = parseInt(integer)
    }

    if (float && checkboxFloat) {
      params['float'] = parseFloat(float)
    }

    if (startDate && endDate && checkboxDate === 'true' || checkboxDate === 'on') {
      params['date'] = { $gte: new Date(startDate), $lte: new Date(endDate) }
    } else if (startDate && checkboxDate === 'true' || checkboxDate === 'on') {
      params['date'] = { $gte: new Date(startDate) }
    } else if (endDate && checkboxDate === 'true' || checkboxDate === 'on') {
      params['date'] = { $lte: new Date(endDate) }
    }

    if (boolean && checkboxBoolean === 'true' || checkboxBoolean === 'on') {
      params['boolean'] = boolean === 'true'
    }

    const limit = 3
    const offset = (page - 1) * limit
    const total = await collection.find(params).count()

    const pages = Math.ceil(total / limit)


    const datas = await collection.find(params).sort(sortParams).limit(limit).skip(offset).toArray();
    res.json({ datas, page: parseInt(page), pages })
  });

  router.post('/', async function (req, res, next) {
    const data = await collection.insertOne({
      number: parseInt(req.body.number),
      string: req.body.string,
      integer: parseInt(req.body.integer),
      float: parseFloat(req.body.float),
      date: new Date(req.body.date),
      boolean: req.body.boolean
    })
    res.json(data)
  });

  router.delete('/:id', async function (req, res, next) {
    const id = req.params.id;

    try {
      const result = await collection.deleteOne({ _id: new ObjectId(id) });
      if (result.deletedCount === 1) {
        res.json({ message: 'Data deleted successfully' });
      } else {
        res.status(404).json({ error: 'Data not found' });
      }
    } catch (error) {
      res.status(500).json({ error: 'Failed to delete data' });
    }
  });

  router.get('/edit/:id', async function (req, res, next) {
    const { id } = req.params;
    try {
      const result = await collection.findOne({ _id: new ObjectId(id) });
      if (result) {
        res.status(200).json(result);
      } else {
        res.status(404).json({ message: 'Data not found' });
      }
    } catch (error) {
      res.status(500).json({ message: 'Internal server error' });
    }
  });

  router.put('/:id', async function (req, res, next) {
    const { id } = req.params;
    const { number, string, integer, float, date, boolean } = req.body;
    try {
      const result = await collection.updateOne(
        { _id: new ObjectId(id) },
        { $set: { number: parseInt(number), string: string, integer: parseInt(integer), float: parseFloat(float), date: date, boolean: boolean } }
      );
      if (result.modifiedCount === 1) {
        res.status(200).json({ message: 'Data updated successfully' });
      } else {
        res.status(404).json({ message: 'Data not found' });
      }
    } catch (error) {
      res.status(500).json({ message: 'Internal server error' });
    }
  });

  return router;
}