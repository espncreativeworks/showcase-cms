var keystone = require('keystone')
  , Post = keystone.list('Post').model
  , utils = require('../utils/');

function listPosts(req, res){
  var doc = utils.queries.defaults.list()
    , q;

  q = Post.find(doc);

  q.exec().then(function(posts){
    if (posts.length){
      res.status(200).json(posts);
    } else {
      utils.errors.notFound(res, []);
    }
  }, function (err){
    res.status(500).json({ name: err.name, message: err.message });
  });
}

function showPost(req, res){
  var key = req.params.key
    , doc = utils.queries.defaults.show(key)
    , q;
  
  q = Post.findOne(doc);
  q = utils.relationships.populate(Post, q, req);

  q.exec().then(function (post){
    res.status(200).json(post);
  }, function (err){
    res.status(500).json({ name: err.name, message: err.message });
  });
}

function createPost(req, res){
  var doc = req.body
    , q;

  q = Post.findOrCreate(doc);

  q.then(function(post){
    res.status(201).json(post);
  }, function (err){
    res.status(500).status({ name: err.name, message: err.message });
  });
}

exports = module.exports = {
  list: listPosts,
  show: showPost,
  create: createPost
};