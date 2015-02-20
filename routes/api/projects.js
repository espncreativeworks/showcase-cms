var keystone = require('keystone')
  , Project = keystone.list('Project').model
  , utils = require('../utils/');

function listProjects(req, res){
  var doc = utils.queries.defaults.list()
  , q;

  q = Project.find(doc);

  q.exec().then(function(projects){
    if (projects){
      res.status(200).json(projects);  
    } else {
      res.status(404).json([]);
    }
  }, function (err){
    res.status(500).json({ name: err.name, message: err.message });
  });
}

function showProject(req, res){
  var key = req.params.key
    , doc = utils.queries.defaults.show(key)
    , q;
  
  q = Project.findOne(doc);
  q = utils.relationships.populate(Project, q, req);

  q.exec().then(function (project){
    if (project){
      res.status(200).json(project);  
    } else {
      res.status(404).json({});
    }
  }, function (err){
    res.status(500).json({ name: err.name, message: err.message });
  });
}

function createProject(req, res){
  var doc = req.body
    , q;

  q = Project.findOrCreate(doc);

  q.then(function(project){
    res.status(201).json(project);
  }, function (err){
    res.status(500).status({ name: err.name, message: err.message });
  });
}

exports = module.exports = {
  list: listProjects,
  show: showProject,
  create: createProject
};