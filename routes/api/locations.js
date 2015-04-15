var keystone = require('keystone')
  , Location = keystone.list('Location').model
  , utils = require('../utils/');

function listLocations(req, res){
  var doc = utils.queries.defaults.list()
    , q;

  q = Location.find(doc);
  q = utils.relationships.populate(Location, q, req);
  
  q.exec().then(function(locations){
    if (locations.length){
      res.status(200).json(locations);
    } else {
      utils.errors.notFound(res, []);
    }
  }, function (err){
    res.status(500).json({ name: err.name, message: err.message });
  });
}

function showLocation(req, res){
  var key = req.params.key
    , doc = utils.queries.defaults.show(key)
    , q;
  
  q = Location.findOne(doc);
  q = utils.relationships.populate(Location, q, req);

  q.exec().then(function (location){
    res.status(200).json(location);
  }, function (err){
    res.status(500).json({ name: err.name, message: err.message });
  });
}

function createLocation(req, res){
  var doc = req.body
    , q;

  q = Location.findOrCreate(doc);

  q.then(function(location){
    res.status(201).json(location);
  }, function (err){
    res.status(500).status({ name: err.name, message: err.message });
  });
}

exports = module.exports = {
  list: listLocations,
  show: showLocation,
  create: createLocation
};