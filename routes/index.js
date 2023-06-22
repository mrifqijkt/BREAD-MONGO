// var express = require('express');
// var router = express.Router();

// module.exports = function (db) {

//   /* GET home page. */

//   router.get('/', (req, res) => {
//     const url = req.url == '/' ? '/?page=1' : req.url
//     const page = req.query.page || 1
//     const limit = 3
//     const offset = (page - 1) * limit

//     const params = []
//     const sqlsearch = []

//     if (req.query.id && req.query.checkboxid) {
//       params.push(req.query.id)
//       sqlsearch.push(`id = $${params.length}`)
//     }

//     if (req.query.String && req.query.checkboxString) {
//       params.push(`%${req.query.String}%`);
//       sqlsearch.push(`string ILIKE $${params.length}`)
//     }

//     if (req.query.Integer && req.query.checkboxInteger) {
//       params.push(req.query.Integer)
//       sqlsearch.push(`integer = $${params.length}`)
//     }

//     if (req.query.Float && req.query.checkboxFloat) {
//       params.push(req.query.Float)
//       sqlsearch.push(`float = $${params.length}`)
//     }

//     if (req.query.startDate && req.query.endDate && req.query.checkboxDate) {
//       params.push(req.query.startDate, req.query.endDate)
//       sqlsearch.push(`date BETWEEN $${params.length - 1} AND $${params.length}`)
//     }

//     if (req.query.Boolean && req.query.checkboxBoolean) {
//       params.push(req.query.Boolean)
//       sqlsearch.push(`boolean = $${params.length}`)
//     }

//     let sql = 'SELECT COUNT(*) AS count FROM bread'
//     if (params.length > 0) {
//       sql += ` WHERE ${sqlsearch.join(' AND ')}`
//     }

//     db.query(sql, params, (err, bread) => {
//       const pages = Math.ceil(bread.rows[0].count / limit)

//       const sort = req.query.sort || 'id' // Default sort column is 'id'
//       const order = req.query.order || 'asc' // Default sort order is 'asc'


//       sql = `SELECT * FROM bread`
//       if (params.length > 0) {
//         sql += ` WHERE ${sqlsearch.join(' AND ')}`
//       }

//       sql += ` ORDER BY ${sort} ${order}` // Add sorting to the SQL query

//       params.push(limit, offset)
//       sql += ` LIMIT $${params.length - 1} OFFSET $${params.length}`
//       db.query(sql, params, (err, bread) => {
//         if (err) {
//           console.error(err)
//         } else {
//           res.render('index', { bread: bread.rows, pages, page, offset, query: req.query, url, moment, sort: sort, order: order })
//         }
//       })
//     })
//   });

//   router.get('/Add', (req, res) => {
//     res.render('add', { item: {}, moment })
//   })

//   router.post('/Add', (req, res) => {
//     const { String, Integer, Float, Date, Boolean } = req.body
//     const sqlAdd = `INSERT INTO bread(String,Integer,Float,Date,Boolean) VALUES ($1,$2,$3,$4,$5)`
//     const values = [String, Integer, Float, Date, Boolean]

//     db.query(sqlAdd, values, (err) => {
//       if (err) {
//         console.log(err)
//       } else {
//         res.redirect('/')
//       }
//     })    // const rows = count.rows[0].total;
//   })

//   router.get('/hapus/:id', (req, res) => {
//     const id = req.params.id
//     const sqlDelete = 'DELETE FROM bread WHERE id = $1'
//     const values = [id]
//     db.query(sqlDelete, values, function (err) {
//       if (err) {
//         console.log(err)
//       } else {
//         res.redirect('/')
//       }
//     })
//   })

//   router.get('/ubah/:id', (req, res) => {
//     const id = req.params.id
//     const sqlEdit = 'SELECT * FROM bread WHERE id = $1'
//     const values = [id]
//     db.query(sqlEdit, values, (err, item) => {
//       if (err) {
//         console.error(err)
//       } else {
//         res.render('edit', { item: item.rows[0], moment })
//       }
//     })
//   })

//   router.post('/ubah/:id', (req, res) => {
//     const id = req.params.id
//     const { String, Integer, Float, Date, Boolean } = req.body
//     const query = 'UPDATE bread SET String = $1, Integer = $2, FLoat = $3, Date = $4, Boolean = $5 WHERE id = $6 ';
//     const values = [String, Integer, Float, Date, Boolean, id];

//     db.query(query, values, function (err) {
//       if (err) {
//         console.log(err);
//       } else {
//         res.redirect('/')
//       }
//     })
//   })

//   return router;
// } 

const express = require('express');
const { MongoClient } = require('mongodb');
const router = express.Router();

module.exports = function () {
  // Connection URL for MongoDB
  const uri = 'mongodb://localhost:27017'; // Replace with your MongoDB connection URL

  // Database and Collection names
  const dbName = 'your_database_name'; // Replace with your database name
  const collectionName = 'bread';

  // Create a MongoDB client
  const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

  // Connect to the MongoDB server
  client.connect((err) => {
    if (err) {
      console.error('Failed to connect to MongoDB:', err);
      return;
    }
    console.log('Connected to MongoDB');

    // Get the database and collection
    const db = client.db(dbName);
    const collection = db.collection(collectionName);

    /* GET home page. */

    // Modify the code to use MongoDB operations
    router.get('/', (req, res) => {
      const url = req.url == '/' ? '/?page=1' : req.url;
      const page = req.query.page || 1;
      const limit = 3;
      const offset = (page - 1) * limit;

      const query = {};

      if (req.query.id && req.query.checkboxid) {
        query.id = req.query.id;
      }

      if (req.query.String && req.query.checkboxString) {
        query.String = { $regex: req.query.String, $options: 'i' };
      }

      if (req.query.Integer && req.query.checkboxInteger) {
        query.Integer = req.query.Integer;
      }

      if (req.query.Float && req.query.checkboxFloat) {
        query.Float = req.query.Float;
      }

      if (req.query.startDate && req.query.endDate && req.query.checkboxDate) {
        query.Date = { $gte: req.query.startDate, $lte: req.query.endDate };
      }

      if (req.query.Boolean && req.query.checkboxBoolean) {
        query.Boolean = req.query.Boolean;
      }

      collection.countDocuments(query, (err, count) => {
        if (err) {
          console.error(err);
          return;
        }
        const pages = Math.ceil(count / limit);

        const sort = req.query.sort || 'id'; // Default sort column is 'id'
        const order = req.query.order || 'asc'; // Default sort order is 'asc'

        collection
          .find(query)
          .sort({ [sort]: order === 'asc' ? 1 : -1 })
          .skip(offset)
          .limit(limit)
          .toArray((err, bread) => {
            if (err) {
              console.error(err);
              return;
            }
            res.render('index', { bread, pages, page, offset, query: req.query, url, moment, sort, order });
          });
      });
    });

    // Modify the code to use MongoDB operations
    router.post('/Add', (req, res) => {
      const { String, Integer, Float, Date, Boolean } = req.body;
      const newItem = { String, Integer, Float, Date, Boolean };

      collection.insertOne(newItem, (err) => {
        if (err) {
          console.error(err);
          return;
        }
        res.redirect('/');
      });
    });

    // Modify the code to use MongoDB operations
    router.get('/hapus/:id', (req, res) => {
      const id = req.params.id;

      collection.deleteOne({ _id: ObjectId(id) }, (err) => {
        if (err) {
          console.error(err);
          return;
        }
        res.redirect('/');
      });
    });

    // Modify the code to use MongoDB operations
    router.get('/ubah/:id', (req, res) => {
      const id = req.params.id;

      collection.findOne({ _id: ObjectId(id) }, (err, item) => {
        if (err) {
          console.error(err);
          return;
        }
        res.render('edit', { item, moment });
      });
    });

    // Modify the code to use MongoDB operations
    router.post('/ubah/:id', (req, res) => {
      const id = req.params.id;
      const { String, Integer, Float, Date, Boolean } = req.body;

      collection.updateOne(
        { _id: ObjectId(id) },
        { $set: { String, Integer, Float, Date, Boolean } },
        (err) => {
          if (err) {
            console.error(err);
            return;
          }
          res.redirect('/');
        }
      );
    });

    // Close the MongoDB connection when the server is stopped
    process.on('SIGINT', () => {
      client.close();
      console.log('Disconnected from MongoDB');
      process.exit(0);
    });
  });

  return router;
};
