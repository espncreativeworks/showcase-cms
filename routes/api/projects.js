var keystone = require('keystone')
  , _ = require('underscore')
  // , Q = require('q')
  , async = require('async')
  , Project = keystone.list('Project').model
  , Industry = keystone.list('Industry').model
  , Execution = keystone.list('Execution').model
  , ExecutionTag = keystone.list('ExecutionTag').model
  , utils = require('../utils/');

function listProjects(req, res){
  var doc = utils.queries.defaults.list()
  , q;

  q = Project.find(doc);
  q = utils.relationships.populate(Project, q, req);
  q.sort('sortOrder');

  q.exec().then(function(projects){
    if (projects.length){
      res.status(200).json(projects);  
    } else {
      utils.errors.notFound(res, []);
    }
  }, function (err){
    utils.errors.internal(res, err);
  });
}

function searchProjects(req, res){
  var doc = utils.queries.defaults.list()
    , q
    , tasks = []
    , result = [];

  q = Project.find(doc);  
  q.select('-__v -description -related -meta -highlights -createdBy -createdAt -updatedBy');
  q.sort('sortOrder');
  q.populate({ 
    path: 'brands',
    select: '-__v -description -related -meta -social -createdBy -createdAt -updatedBy -updatedAt'
  });
  q.populate({ 
    path: 'sports',
    select: '-__v -description -related -meta -social -createdBy -createdAt -updatedBy -updatedAt'
  });
  q.populate({ 
    path: 'hero',
    select: '-__v -description -caption -credit -usage -people -tags -related -meta -social -createdBy -createdAt -updatedBy -updatedAt'
  });

  q.exec().then(function(projects){
    if (projects){
      result = result.concat(projects); // copy the array
      result.forEach(function (_project, i){
        var project = _.clone(_project.toJSON()); // clone the project object as JSON 
        result.splice(i, 1, project); // replace the mongoose doc with the project object
        
        // prepare industry population task
        var industryIds = [];
        project.industries = [];
        if (project.brands.length){
          project.brands.forEach(function (brand){
            if (brand.industries.length){
              brand.industries.forEach(function (industryId){
                industryIds.push(industryId);
              });
            }
          });  
        }
        industryIds = _.uniq(industryIds);

        var industryDoc = utils.queries.defaults.list()
          , industryQuery = Industry.find(industryDoc);

        industryQuery.where('_id').in(industryIds);
        industryQuery.select('-__v -description -related -meta -social -createdBy -createdAt -updatedBy -updatedAt');
        
        // capture scope with task closure
        var industryTask = function (callback){
          industryQuery.exec().then(function (industries){
            if (industries.length){
              industries.forEach(function (industry){
                project.industries.push(_.clone(industry.toJSON()));
              });
              callback(null, project.industries);
            } else {
              callback(null, []);
            }
          }, function (err){
            callback(err, null);
          });
        };
        // push task onto tasks to complete
        tasks.push(industryTask);

        // prepare execution population task
        var executionIds = [];
        project.executions.forEach(function (executionId){
          executionIds.push(executionId); 
        });
        
        project.executions = []; // clear executions array; add populated objects to array on project later
        project.tags = [];
        project.platforms = [];

        var executionDoc = utils.queries.defaults.list()
          , executionQuery = Execution.find(executionDoc);

        executionQuery.where('_id').in(executionIds);
        executionQuery.select('-__v -description -related -meta -social -createdBy -createdAt -updatedBy -updatedAt -images -videos -documents');
        executionQuery.populate({ 
          path: 'platform',
          select: '-__v -description -related -meta -social -createdBy -createdAt -updatedBy -updatedAt'
        });
        executionQuery.populate({ 
          path: 'tags',
          select: '-__v -description -related -meta -social -createdBy -createdAt -updatedBy -updatedAt'
        });

        // capture scope with task closure
        var executionTask = function (callback){
          executionQuery.exec().then(function (executions){
            if (executions.length){
              project.executions = executions;
              executions.forEach(function (execution){
                if (execution.tags.length){
                  execution.tags.forEach(function (tag){
                    project.tags.push(_.clone(tag.toJSON()));
                  });
                }
                if (execution.platform){
                  project.platforms.push(_.clone(execution.platform.toJSON()));
                }
              });
              project.tags = _.uniq(project.tags, function (t){ return t._id; });
              project.platforms = _.uniq(project.platforms, function (p){ return p._id; });
              callback(null, executions);
            } else {
              callback(null, []);
            }
          }, function (err){
            callback(err, null);
          });
        };
        // push task onto tasks to complete
        tasks.push(executionTask);

      });
      
      var done = function (err){
        if (err){
          return utils.errors.internal(res, err);
        }
        return res.status(200).json(result);
      };

      async.parallel(tasks, done);

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
  q.sort('sortOrder');

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

function monitorProjects(req, res){
  res.status(200).end();
}

exports = module.exports = {
  list: listProjects,
  featured: featuredProjects,
  search: searchProjects,
  show: showProject,
  executions: showProjectExecutions,
  tags: showProjectTags,
  create: createProject,
  monitor: monitorProjects
};