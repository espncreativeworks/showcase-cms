var keystone = require('keystone')
  , Execution = keystone.list('Execution').model
  , utils = require('../utils/');

function listExecutions(req, res){
  var doc = utils.queries.defaults.list()
    , q;

  q = Execution.find(doc);
  q.sort('sortOrder');

  q.exec().then(function(executions){
    res.status(200).json(executions);
  }, function (err){
    res.status(500).json({ name: err.name, message: err.message });
  });
}

function showExecution(req, res){
  var key = req.params.key
    , doc = utils.queries.defaults.show(key)
    , q;
  
  q = Execution.findOne(doc);
  q = utils.relationships.populate(Execution, q, req);

  q.exec().then(function (execution){
    res.status(200).json(execution);
  }, function (err){
    res.status(500).json({ name: err.name, message: err.message });
  });
}

function createExecution(req, res){
  var doc = req.body
    , q;

  q = Execution.findOrCreate(doc);

  q.then(function(execution){
    res.status(201).json(execution);
  }, function (err){
    res.status(500).status({ name: err.name, message: err.message });
  });
}

exports = module.exports = {
  list: listExecutions,
  show: showExecution,
  create: createExecution
};