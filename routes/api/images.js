var keystone = require('keystone')
  , _Image = keystone.list('Image').model
  , utils = require('../utils/');

function listImages(req, res){
  var doc = utils.queries.defaults.list()
    , q;

  q = _Image.find(doc);
  q.sort('sortOrder');

  q.exec().then(function(images){
    res.status(200).json(images);
  }, function (err){
    res.status(500).json({ name: err.name, message: err.message });
  });
}

function showImage(req, res){
  var key = req.params.key
    , doc = utils.queries.defaults.show(key)
    , q;
  
  q = _Image.findOne(doc);
  q = utils.relationships.populate(_Image, q, req);

  q.exec().then(function (_image){
    res.status(200).json(_image);
  }, function (err){
    res.status(500).json({ name: err.name, message: err.message });
  });
}

function createImage(req, res){
  var doc = req.body
    , q;

  q = _Image.findOrCreate(doc);

  q.then(function(_image){
    res.status(201).json(_image);
  }, function (err){
    res.status(500).status({ name: err.name, message: err.message });
  });
}

exports = module.exports = {
  list: listImages,
  show: showImage,
  create: createImage
};