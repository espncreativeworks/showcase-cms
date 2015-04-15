var keystone = require('keystone')
  , PostTag = keystone.list('PostTag').model
  , utils = require('../utils/');

function listPostTags(req, res){
  var doc = utils.queries.defaults.list()
    , q;

  q = PostTag.find(doc);

  q.exec().then(function(postTags){
    if (postTags.length){
      res.status(200).json(postTags);
    } else {
      utils.errors.notFound(res, []);
    }
  }, function (err){
    res.status(500).json({ name: err.name, message: err.message });
  });
}

function showPostTag(req, res){
  var key = req.params.key
    , doc = utils.queries.defaults.show(key)
    , q;
  
  q = PostTag.findOne(doc);
  q = utils.relationships.populate(PostTag, q, req);

  q.exec().then(function (postTag){
    res.status(200).json(postTag);
  }, function (err){
    res.status(500).json({ name: err.name, message: err.message });
  });
}

function createPostTag(req, res){
  var doc = req.body
    , q;

  q = PostTag.findOrCreate(doc);

  q.then(function(postTag){
    res.status(201).json(postTag);
  }, function (err){
    res.status(500).status({ name: err.name, message: err.message });
  });
}

exports = module.exports = {
  list: listPostTags,
  show: showPostTag,
  create: createPostTag
};