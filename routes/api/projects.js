var keystone = require('keystone')
  , Project = keystone.list('Project').model
  , Execution = keystone.list('Execution').model
  , ExecutionTag = keystone.list('ExecutionTag').model
  , utils = require('../utils/');

function listProjects(req, res){
  var doc = utils.queries.defaults.list()
  , q;

  q = Project.find(doc);
  q = utils.relationships.populate(Project, q, req);

  q.exec().then(function(projects){
    if (projects){
      res.status(200).json(projects);  
    } else {
      utils.errors.notFound(res, []);
    }
  }, function (err){
    utils.errors.internal(res, err);
  });
}

function featuredProjects(req, res){
  var doc = utils.queries.defaults.list()
  , q;

  doc.$and.push({ isFeatured: true });

  q = Project.find(doc);
  q = utils.relationships.populate(Project, q, req);

  q.exec().then(function(projects){
    if (projects){
      res.status(200).json(projects);  
    } else {
      utils.errors.notFound(res, []);
    }
  }, function (err){
    utils.errors.internal(res, err);
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
      utils.errors.notFound(res, {});
    }
  }, function (err){
    utils.errors.internal(res, err);
  });
}

function showProjectExecutions(req, res){
  var key = req.params.key
    , doc = utils.queries.defaults.show(key)
    , q;
  
  q = Project.findOne(doc);
  
  q.exec().then(function (project){
    if (project){
      var _q = Execution.find().in('_id', project.executions);
      _q = utils.relationships.populate(Execution, _q, req);
      return _q.exec();
    } else {
      utils.errors.notFound(res, []);
    }
  }).then(function (executions){
    if (executions){
      res.status(200).json(executions);
    } else {
      utils.errors.notFound(res, []);
    }
  }, function (err){
    utils.errors.internal(res, err);
  });
}

function showProjectTags(req, res){
  var key = req.params.key
    , doc = utils.queries.defaults.show(key)
    , q;
  
  q = Project.findOne(doc);
  q = utils.relationships.populate(Project, q, req);

  q.exec().then(function (project){
    if (project){
      return Execution.find().in('_id', project.executions).exec();
    } else {
      utils.errors.notFound(res, []);
    }
  }).then(function (executions){
    if (executions){
      var tagIds = []; 
      executions.forEach(function (execution){
        execution.tags.forEach(function (tag){
          tagIds.push(tag);
        });
      });
      return ExecutionTag.find().in('_id', tagIds).exec();
    } else {
      utils.errors.notFound(res, []);
    }
  }).then(function (tags){
    if (tags){
      res.status(200).json(tags);
    } else {
      utils.errors.notFound(res, []);
    }
  }, function (err){
    utils.errors.internal(res, err);
  });
}

function createProject(req, res){
  var doc = req.body
    , q;

  q = Project.findOrCreate(doc);

  q.then(function(project){
    res.status(201).json(project);
  }, function (err){
    utils.errors.internal(res, err);
  });
}

exports = module.exports = {
  list: listProjects,
  featured: featuredProjects,
  show: showProject,
  executions: showProjectExecutions,
  tags: showProjectTags,
  create: createProject
};