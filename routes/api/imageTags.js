var keystone = require('keystone')
  , ImageTag = keystone.list('ImageTag').model
  , utils = require('../utils/');

function listImageTags(req, res){
  var doc = utils.queries.defaults.list({ status: false })
    , q;

  q = ImageTag.find(doc);

  q.exec().then(function(imageTags){
    if (imageTags.length){
      res.status(200).json(imageTags);  
    } else {
      utils.errors.notFound(res, []);
    }
  }, function (err){
    res.status(500).json({ name: err.name, message: err.message });
  });
}

function showImageTag(req, res){
  var key = req.params.key
    , doc = utils.queries.defaults.show(key)
    , q;
  
  q = ImageTag.findOne(doc);
  q = utils.relationships.populate(ImageTag, q, req);

  q.exec().then(function (imageTag){
    res.status(200).json(imageTag);
  }, function (err){
    res.status(500).json({ name: err.name, message: err.message });
  });
}

function createImageTag(req, res){
  var doc = req.body
    , q;

  q = ImageTag.findOrCreate(doc);

  q.then(function(imageTag){
    res.status(201).json(imageTag);
  }, function (err){
    res.status(500).status({ name: err.name, message: err.message });
  });
}

exports = module.exports = {
  list: listImageTags,
  show: showImageTag,
  create: createImageTag
};