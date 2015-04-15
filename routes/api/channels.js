var keystone = require('keystone')
  , Channel = keystone.list('Channel').model
  , utils = require('../utils/');

function listChannels(req, res){
  var doc = utils.queries.defaults.list()
    , q;

  q = Channel.find(doc);

  q.exec().then(function(channels){
    if (channels.length){
      res.status(200).json(channels);
    } else {
      utils.errors.notFound(res, []);
    }
  }, function (err){
    res.status(500).json({ name: err.name, message: err.message });
  });
}

function showChannel(req, res){
  var key = req.params.key
    , doc = utils.queries.defaults.show(key)
    , q;
  
  q = Channel.findOne(doc);
  q = utils.relationships.populate(Channel, q, req);

  q.exec().then(function (channel){
    res.status(200).json(channel);
  }, function (err){
    res.status(500).json({ name: err.name, message: err.message });
  });
}

function createChannel(req, res){
  var doc = req.body
    , q;

  q = Channel.findOrCreate(doc);

  q.then(function(channel){
    res.status(201).json(channel);
  }, function (err){
    res.status(500).status({ name: err.name, message: err.message });
  });
}

exports = module.exports = {
  list: listChannels,
  show: showChannel,
  create: createChannel
};