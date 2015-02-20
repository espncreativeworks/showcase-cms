var keystone = require('keystone')
  , Timezone = keystone.list('Timezone').model
  , utils = require('../utils/');

function listTimezones(req, res){
  var doc = utils.queries.defaults.list()
    , q;

  q = Timezone.find(doc);

  q.exec().then(function(timezones){
    res.status(200).json(timezones);
  }, function (err){
    res.status(500).json({ name: err.name, message: err.message });
  });
}

function showTimezone(req, res){
  var key = req.params.key
    , doc = utils.queries.defaults.show(key)
    , q;
  
  q = Timezone.findOne(doc);
  q = utils.relationships.populate(Timezone, q, req);

  q.exec().then(function (timezone){
    res.status(200).json(timezone);
  }, function (err){
    res.status(500).json({ name: err.name, message: err.message });
  });
}

function createTimezone(req, res){
  var doc = req.body
    , q;

  q = Timezone.findOrCreate(doc);

  q.then(function(timezone){
    res.status(201).json(timezone);
  }, function (err){
    res.status(500).status({ name: err.name, message: err.message });
  });
}

exports = module.exports = {
  list: listTimezones,
  show: showTimezone,
  create: createTimezone
};