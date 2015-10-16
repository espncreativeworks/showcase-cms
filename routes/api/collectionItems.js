var keystone = require('keystone')
  , _ = require('underscore')
  , Q = require('q')
  , CollectionItem = keystone.list('CollectionItem').model
  , utils = require('../utils/');

function listCollectionItems(req, res){
  var q;
  
  q = CollectionItem.find();
  q = utils.relationships.populate(CollectionItem, q, req);

  q.exec().then(function(collectionItems){
    if (collectionItems.length){
      res.status(200).json(collectionItems);  
    } else {
      utils.errors.notFound(res, []);
    }
  }, function (err){
    utils.errors.internal(res, err);
  });
}

function showCollectionItem(req, res){
  var key = req.params.key
    , q;

  q = CollectionItem.findOne().where('_id', key);
  q = utils.relationships.populate(CollectionItem, q, req);

  q.exec().then(function (collectionItem){
    if (collectionItem){
      res.status(200).json(collectionItem);  
    } else {
      utils.errors.notFound(res, {});
    }
  }, function (err){
    utils.errors.internal(res, err);
  });
}

function createCollectionItem(req, res){
  var doc = req.body
    , q;

  q = CollectionItem.findOrCreate(doc);

  q.then(function(collectionItem){
    res.status(201).json(collectionItem);
  }, function (err){
    utils.errors.internal(res, err);
  });
}

function updateCollectionItem (req, res){
  var key = req.params.key
    , q;

  q = CollectionItem.findOne().where('_id', key);

  q.exec().then(function (collectionItem) {
    var deferred = Q.defer(), body;

    if (!collectionItem) { 
      utils.errors.notFound(res, {}); 
    } else {
      body = _.omit(req.body, '_id');

      _.each(_.keys(body), function (key){
        // console.log("update collection item: ", key)
        collectionItem[key] = body[key];
      });

      collectionItem.save(function (err, doc){
        // console.log("doc: ", doc);
        if (err){
          // console.log("collection item save failed: ", err);
          deferred.reject(err);
        } else {
          // console.log("collection item saved: \n", doc)
          deferred.resolve(doc);
        }
      });
    }

    return deferred.promise;
  }).then(function (collectionItem){
    // console.log("success: ", collectionItem)
    res.status(200).json(collectionItem);
  }, function (err){
    utils.errors.internal(res, err);
  });
}

function destroyCollectionItem (req, res){
  var key = req.params.key
    , q;
  
  q = CollectionItem.findOne().where('_id', key);

  q.exec().then(function (collectionItem) {
    var deferred = Q.defer();

    if (!collectionItem) { 
      utils.errors.notFound(res, {}); 
    } else {
      collectionItem.remove(function(err) {
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
  list: listCollectionItems,
  show: showCollectionItem,
  create: createCollectionItem,
  update: updateCollectionItem,
  destroy: destroyCollectionItem
};