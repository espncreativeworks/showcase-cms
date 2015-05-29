var keystone = require('keystone')
  , Video = keystone.list('Video').model
  , utils = require('../utils/');

function listVideos(req, res){
  var doc = utils.queries.defaults.list()
    , q;

  q = Video.find(doc);
  q = utils.relationships.populate(Video, q, req);
  q.sort('sortOrder');
  
  q.exec().then(function(videos){
    if (videos.length){
      res.status(200).json(videos);
    } else {
      utils.errors.notFound(res, []);
    }
  }, function (err){
    res.status(500).json({ name: err.name, message: err.message });
  });
}

function showVideo(req, res){
  var key = req.params.key
    , doc = utils.queries.defaults.show(key)
    , q;
  
  q = Video.findOne(doc);
  q = utils.relationships.populate(Video, q, req);

  q.exec().then(function (video){
    res.status(200).json(video);
  }, function (err){
    res.status(500).json({ name: err.name, message: err.message });
  });
}

function createVideo(req, res){
  var doc = req.body
    , q;

  q = Video.findOrCreate(doc);

  q.then(function(video){
    res.status(201).json(video);
  }, function (err){
    res.status(500).status({ name: err.name, message: err.message });
  });
}

exports = module.exports = {
  list: listVideos,
  show: showVideo,
  create: createVideo
};