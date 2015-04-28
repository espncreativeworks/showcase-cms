var keystone = require('keystone')
  , DocumentTag = keystone.list('DocumentTag').model
  , utils = require('../utils/');

function listDocumentTags(req, res){
  var doc = utils.queries.defaults.list({ status: false })
    , q;

  q = DocumentTag.find(doc);

  q.exec().then(function(documentTags){
    if (documentTags.length){
      res.status(200).json(documentTags);
    } else {
      utils.errors.notFound(res, []);
    }
  }, function (err){
    res.status(500).json({ name: err.name, message: err.message });
  });
}

function showDocumentTag(req, res){
  var key = req.params.key
    , doc = utils.queries.defaults.show(key)
    , q;
  
  q = DocumentTag.findOne(doc);
  q = utils.relationships.populate(DocumentTag, q, req);

  q.exec().then(function (documentTag){
    res.status(200).json(documentTag);
  }, function (err){
    res.status(500).json({ name: err.name, message: err.message });
  });
}

function createDocumentTag(req, res){
  var doc = req.body
    , q;

  q = DocumentTag.findOrCreate(doc);

  q.then(function(documentTag){
    res.status(201).json(documentTag);
  }, function (err){
    res.status(500).status({ name: err.name, message: err.message });
  });
}

exports = module.exports = {
  list: listDocumentTags,
  show: showDocumentTag,
  create: createDocumentTag
};