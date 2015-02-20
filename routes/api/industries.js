var keystone = require('keystone')
  , Industry = keystone.list('Industry').model
  , utils = require('../utils/');

function listIndustries(req, res){
  var doc = utils.queries.defaults.list()
    , q;

  q = Industry.find(doc);

  q.exec().then(function(industries){
    res.status(200).json(industries);
  }, function (err){
    res.status(500).json({ name: err.name, message: err.message });
  });
}

function showIndustry(req, res){
  var key = req.params.key
    , doc = utils.queries.defaults.show(key)
    , q;
  
  q = Industry.findOne(doc);
  q = utils.relationships.populate(Industry, q, req);

  q.exec().then(function (industry){
    res.status(200).json(industry);
  }, function (err){
    res.status(500).json({ name: err.name, message: err.message });
  });
}

function createIndustry(req, res){
  var doc = req.body
    , q;

  q = Industry.findOrCreate(doc);

  q.then(function(industry){
    res.status(201).json(industry);
  }, function (err){
    res.status(500).status({ name: err.name, message: err.message });
  });
}

exports = module.exports = {
  list: listIndustries,
  show: showIndustry,
  create: createIndustry
};