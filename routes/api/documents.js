var keystone = require('keystone')
  , _Document = keystone.list('Document').model
  , utils = require('../utils/');

function listDocuments(req, res){
  var doc = utils.queries.defaults.list()
    , q;

  q = _Document.find(doc);
  q.sort('sortOrder');

  q.exec().then(function(_documents){
    if (_documents.length){
      res.status(200).json(_documents);
    } else {
      utils.errors.notFound(res, []);
    }
  }, function (err){
    res.status(500).json({ name: err.name, message: err.message });
  });
}

function showDocument(req, res){
  var key = req.params.key
    , doc = utils.queries.defaults.show(key)
    , q;
  
  q = _Document.findOne(doc);
  q = utils.relationships.populate(_Document, q, req);

  q.exec().then(function (_document){
    res.status(200).json(_document);
  }, function (err){
    res.status(500).json({ name: err.name, message: err.message });
  });
}

function createDocument(req, res){
  var doc = req.body
    , q;

  q = _Document.findOrCreate(doc);

  q.then(function(_document){
    res.status(201).json(_document);
  }, function (err){
    res.status(500).status({ name: err.name, message: err.message });
  });
}

exports = module.exports = {
  list: listDocuments,
  show: showDocument,
  create: createDocument
};