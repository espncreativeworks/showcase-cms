var keystone = require('keystone')
  , VideoTag = keystone.list('VideoTag').model
  , utils = require('../utils/');

function listVideoTags(req, res){
  var doc = utils.queries.defaults.list()
    , q;

  q = VideoTag.find(doc);

  q.exec().then(function(videoTags){
    res.status(200).json(videoTags);
  }, function (err){
    res.status(500).json({ name: err.name, message: err.message });
  });
}

function showVideoTag(req, res){
  var key = req.params.key
    , doc = utils.queries.defaults.show(key)
    , q;
  
  q = VideoTag.findOne(doc);
  q = utils.relationships.populate(VideoTag, q, req);

  q.exec().then(function (videoTag){
    res.status(200).json(videoTag);
  }, function (err){
    res.status(500).json({ name: err.name, message: err.message });
  });
}

function createVideoTag(req, res){
  var doc = req.body
    , q;

  q = VideoTag.findOrCreate(doc);

  q.then(function(videoTag){
    res.status(201).json(videoTag);
  }, function (err){
    res.status(500).status({ name: err.name, message: err.message });
  });
}

exports = module.exports = {
  list: listVideoTags,
  show: showVideoTag,
  create: createVideoTag
};