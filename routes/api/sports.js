var keystone = require('keystone')
  , Sport = keystone.list('Sport').model
  , utils = require('../utils/');

function listSports(req, res){
  var doc = utils.queries.defaults.list()
    , q;

  q = Sport.find(doc);
  q.sort('sortOrder');

  q.exec().then(function(sports){
    if (sports.length){
      res.status(200).json(sports);
    } else {
      utils.errors.notFound(res, []);
    }
  }, function (err){
    res.status(500).json({ name: err.name, message: err.message });
  });
}

function showSport(req, res){
  var key = req.params.key
    , doc = utils.queries.defaults.show(key)
    , q;
  
  q = Sport.findOne(doc);
  q = utils.relationships.populate(Sport, q, req);

  q.exec().then(function (sport){
    res.status(200).json(sport);
  }, function (err){
    res.status(500).json({ name: err.name, message: err.message });
  });
}

function createSport(req, res){
  var doc = req.body
    , q;

  q = Sport.findOrCreate(doc);

  q.then(function(sport){
    res.status(201).json(sport);
  }, function (err){
    res.status(500).status({ name: err.name, message: err.message });
  });
}

exports = module.exports = {
  list: listSports,
  show: showSport,
  create: createSport
};