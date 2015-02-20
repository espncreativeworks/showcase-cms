var keystone = require('keystone')
  , Platform = keystone.list('Platform').model
  , utils = require('../utils/');

function listPlatforms(req, res){
  var doc = utils.queries.defaults.list()
    , q;

  q = Platform.find(doc);

  q.exec().then(function(platforms){
    res.status(200).json(platforms);
  }, function (err){
    res.status(500).json({ name: err.name, message: err.message });
  });
}

function showPlatform(req, res){
  var key = req.params.key
    , doc = utils.queries.defaults.show(key)
    , q;
  
  q = Platform.findOne(doc);
  q = utils.relationships.populate(Platform, q, req);

  q.exec().then(function (platform){
    res.status(200).json(platform);
  }, function (err){
    res.status(500).json({ name: err.name, message: err.message });
  });
}

function createPlatform(req, res){
  var doc = req.body
    , q;

  q = Platform.findOrCreate(doc);

  q.then(function(platform){
    res.status(201).json(platform);
  }, function (err){
    res.status(500).status({ name: err.name, message: err.message });
  });
}

exports = module.exports = {
  list: listPlatforms,
  show: showPlatform,
  create: createPlatform
};