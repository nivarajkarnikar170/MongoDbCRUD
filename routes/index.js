var express = require('express');
var router = express.Router();
const bodyParser = require('body-parser');
router.use(bodyParser.urlencoded({ extended: true }))
router.use(bodyParser.json())
var mongoClient = require('mongodb').MongoClient;
var url = require('url');
var queryString = require('querystring');
var db;

mongoClient.connect('mongodb://localhost:27017/map', function (err, database) {
  if (err) return console.log(err);
  db = database;
  console.log("Database Connection Established!!");
})

router.use(function (req, res, next) {
  // this middleware will call for each requested
  // and we checked for the requested query properties
  // if _method was existed
  // then we know, clients need to call DELETE request instead
  console.log(req.url);
  if (req.query._method == 'PUT') {
    // change the original METHOD
    // into DELETE method
    req.method = 'PUT';
    // and set requested url to /user/12
    //req.url = req.path;
  }
  if (req.query._method == 'DELETE') {
    // change the original METHOD
    // into DELETE method
    req.method = 'DELETE';
    // and set requested url to /user/12
    //req.url = req.path;
  }
  next();
});
/* GET home page. */
router.get('/', function (req, res, next) {
  db.collection('locations').find().toArray(function (err, result) {
    if (err) return console.log(err);
    console.dir(result);
    console.dir(result[0].name);
    res.render('index', { title: 'Mongo CRUD', data: result });
  })
});

router.post('/', function (req, res, next) {
  var query = { name: req.body.name };
  var data = {
    name: req.body.name,
    category: req.body.category,
    location: {
      type: "Point",
      coordinates: [parseFloat(req.body.longitude), parseFloat(req.body.latitude)]
    }
  };

  var option = { upsert: true };

  db.collection('locations').update(query, data, option, function (err, result) {
    if (err) return console.log(err);
    console.dir(result);
    // res.send("Updated");
    res.redirect('http://localhost:4000/');
  })
});


router.delete('/delete/:id', function (req, res, next) {
  console.log("ddd");
  console.log(req.params.id);
  console.log(req.url);
  var query = url.parse(req.url).query;
  var name = queryString.parse(query)["param"];
  console.log(name);
  var q = { name: name };

  db.collection('locations').remove(q, function (err, result) {
    if (err) return console.log(err);
    console.log("Record Deleted");
    res.redirect('http://localhost:4000/');
    // res.render('update', { title: 'Update Record', data: result });
  });

});

router.put('/update/:id', function(req, res, next) {
   console.log("ddd");
   console.log(req.url);
   var query = url.parse(req.url).query;
   var name = queryString.parse(query)["param"];
   console.log(name);
   var q = {name: name};

   db.collection('locations').findOne(q ,function(err, result){
    if(err) return console.log(err);
     console.dir(result);
     console.dir(result.category);
    res.render('update', { title: 'Update Record', data: result });
  });
});

module.exports = router;
