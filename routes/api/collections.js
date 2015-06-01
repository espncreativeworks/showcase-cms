var keystone = require('keystone')
  , _ = require('underscore')
  , Q = require('q')
  , Collection = keystone.list('Collection').model
  , utils = require('../utils/');

function listCollections(req, res){
  var doc = utils.queries.defaults.list()
    , q;

  doc.$and.push({ visibility: 'public' });

  q = Collection.find(doc);
  q = utils.relationships.populate(Collection, q, req);

  q.exec().then(function(collections){
    if (collections.length){
      res.status(200).json(collections);  
    } else {
      utils.errors.notFound(res, []);
    }
  }, function (err){
    utils.errors.internal(res, err);
  });
}

function listAccountCollections(req, res){
  var doc = utils.queries.defaults.list()
    , q;

  doc.$and.push({ creator: req.params.accountId });
  doc.$and.push({ visibility: 'public' });

  q = Collection.find(doc);
  q = utils.relationships.populate(Collection, q, req);

  q.exec().then(function(collections){
    if (collections.length){
      res.status(200).json(collections);  
    } else {
      utils.errors.notFound(res, []);
    }
  }, function (err){
    utils.errors.internal(res, err);
  });
}

function listMyCollections(req, res){
  var doc = utils.queries.defaults.list()
    , q;

  doc.$and.push({ creator: req.get('X-Account-Id') });

  q = Collection.find(doc);
  q = utils.relationships.populate(Collection, q, req);

  q.exec().then(function(collections){
    if (collections.length){
      res.status(200).json(collections);  
    } else {
      utils.errors.notFound(res, []);
    }
  }, function (err){
    utils.errors.internal(res, err);
  });
}

function showCollection(req, res){
  var key = req.params.key
    , doc = utils.queries.defaults.show(key)
    , q;

  doc.$and.push({ visibility: 'public' });
  
  q = Collection.findOne(doc);
  q = utils.relationships.populate(Collection, q, req);

  q.exec().then(function (collection){
    if (collection){
      res.status(200).json(collection);  
    } else {
      utils.errors.notFound(res, {});
    }
  }, function (err){
    utils.errors.internal(res, err);
  });
}

function showAccountCollection(req, res){
  var key = req.params.key
    , doc = utils.queries.defaults.show(key)
    , q;
  
  doc.$and.push({ creator: req.params.accountId });
  doc.$and.push({ visibility: 'public' });

  q = Collection.findOne(doc);
  q = utils.relationships.populate(Collection, q, req);

  q.exec().then(function (collection){
    if (collection){
      res.status(200).json(collection);  
    } else {
      utils.errors.notFound(res, {});
    }
  }, function (err){
    utils.errors.internal(res, err);
  });
}

function showMyCollection(req, res){
  var key = req.params.key
    , doc = utils.queries.defaults.show(key)
    , q;
  
  doc.$and.push({ creator: req.get('X-Account-Id') });

  q = Collection.findOne(doc);
  q = utils.relationships.populate(Collection, q, req);

  q.exec().then(function (collection){
    if (collection){
      res.status(200).json(collection);  
    } else {
      utils.errors.notFound(res, {});
    }
  }, function (err){
    utils.errors.internal(res, err);
  });
}


function createCollection(req, res){
  var doc = req.body
    , q;

  q = Collection.findOrCreate(doc);

  q.then(function(collection){
    res.status(201).json(collection);
  }, function (err){
    utils.errors.internal(res, err);
  });
}

function updateCollection (req, res){
  var key = req.params.key
    , doc = utils.queries.defaults.show(key)
    , q;

  q = Collection.findOne(doc);

  q.exec().then(function (collection) {
    var deferred = Q.defer(), body;

    if (!collection) { 
      utils.errors.notFound(res, {}); 
    } else {
      body = _.omit(req.body, '_id');

      _.each(_.keys(body), function (key){
        collection[key] = body[key];
      });

      collection.save(function (err, doc){
        if (err){
          deferred.reject(err);
        } else {
          deferred.resolve(doc);
        }
      });
    }

    return deferred.promise;
  }).then(function (collection){
    res.status(200).json(collection);
  }, function (err){
    utils.errors.internal(res, err);
  });
}

function destroyCollection (req, res){
  var key = req.params.key
    , doc = utils.queries.defaults.show(key)
    , q;
  
  q = Collection.findOne(doc);

  q.exec().then(function (collection) {
    var deferred = Q.defer();

    if (!collection) { 
      utils.errors.notFound(res, {}); 
    } else {
      collection.remove(function(err) {
        if (err) { 
          deferred.reject(err);
        } else {
          deferred.resolve();  
        }
      });
    }

    return deferred.promise;
  }).then(function (){
    res.sendStatus(204);
  }, function (err){
    utils.errors.internal(res, err);
  });
}

exports = module.exports = {
  list: listCollections,
  show: showCollection,
  create: createCollection,
  update: updateCollection,
  destroy: destroyCollection,
  me: {
    list: listMyCollections,
    show: showMyCollection
  },
  account: {
    list: listAccountCollections,
    show: showAccountCollection
  }
};