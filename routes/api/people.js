var keystone = require('keystone')
  , Person = keystone.list('Person').model
  , utils = require('../utils/');

function listPeople(req, res){
  var doc = utils.queries.defaults.list()
    , q;

  q = Person.find(doc);

  q.exec().then(function(people){
    if (people.length){
      res.status(200).json(people);
    } else {
      utils.errors.notFound(res, []);
    }
  }, function (err){
    res.status(500).json({ name: err.name, message: err.message });
  });
}

function showPerson(req, res){
  var key = req.params.key
    , doc = utils.queries.defaults.show(key)
    , q;
  
  q = Person.findOne(doc);
  q = utils.relationships.populate(Person, q, req);

  q.exec().then(function (person){
    res.status(200).json(person);
  }, function (err){
    res.status(500).json({ name: err.name, message: err.message });
  });
}

function createPerson(req, res){
  var doc = req.body
    , q;

  q = Person.findOrCreate(doc);

  q.then(function(person){
    res.status(201).json(person);
  }, function (err){
    res.status(500).status({ name: err.name, message: err.message });
  });
}

exports = module.exports = {
  list: listPeople,
  show: showPerson,
  create: createPerson
};