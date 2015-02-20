var keystone = require('keystone')
  , User = keystone.list('User').model
  , utils = require('../utils/');

function listUsers(req, res){
  var doc = utils.queries.defaults.list()
    , q;

  q = User.find(doc);

  q.exec().then(function(users){
    res.status(200).json(users);
  }, function (err){
    res.status(500).json({ name: err.name, message: err.message });
  });
}

function showUser(req, res){
  var key = req.params.key
    , doc = utils.queries.defaults.show(key)
    , q;
  
  q = User.findOne(doc);
  q = utils.relationships.populate(User, q, req);

  q.exec().then(function (user){
    res.status(200).json(user);
  }, function (err){
    res.status(500).json({ name: err.name, message: err.message });
  });
}

function createUser(req, res){
  var doc = req.body
    , q;

  q = User.findOrCreate(doc);

  q.then(function(user){
    res.status(201).json(user);
  }, function (err){
    res.status(500).status({ name: err.name, message: err.message });
  });
}

exports = module.exports = {
  list: listUsers,
  show: showUser,
  create: createUser
};