var keystone = require('keystone')
  , ExecutionTag = keystone.list('ExecutionTag').model
  , utils = require('../utils/');

function listExecutionTags(req, res){
  var doc = utils.queries.defaults.list()
    , q;

  q = ExecutionTag.find(doc);

  q.exec().then(function(executionTags){
    if (executionTags.length){
      res.status(200).json(executionTags);
    } else {
      utils.errors.notFound(res, []);
    }
  }, function (err){
    res.status(500).json({ name: err.name, message: err.message });
  });
}

function showExecutionTag(req, res){
  var key = req.params.key
    , doc = utils.queries.defaults.show(key)
    , q;
  
  q = ExecutionTag.findOne(doc);
  q = utils.relationships.populate(ExecutionTag, q, req);

  q.exec().then(function (executionTag){
    res.status(200).json(executionTag);
  }, function (err){
    res.status(500).json({ name: err.name, message: err.message });
  });
}

function createExecutionTag(req, res){
  var doc = req.body
    , q;

  q = ExecutionTag.findOrCreate(doc);

  q.then(function(executionTag){
    res.status(201).json(executionTag);
  }, function (err){
    res.status(500).status({ name: err.name, message: err.message });
  });
}

exports = module.exports = {
  list: listExecutionTags,
  show: showExecutionTag,
  create: createExecutionTag
};