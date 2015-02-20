var keystone = require('keystone')
  , _ = require('underscore')
  , Q = require('q');

/**
 * Adds a 'findOrCreate' static method to the List's schema
 *
 * @param {Object} opts
 * @api public
 */

function _addFindOrCreate (opts){
  if (!_.has(opts, 'list')){
    throw new Error('Invalid opts: \'list\' is required');
  }

  if (!_.has(opts, 'validKeys')){
    throw new Error('Invalid opts: \'validKeys\' is required');
  }

  if (!_.isArray(opts.validKeys)){
    throw new Error('Invalid opts: \'validKeys\' must be an Array');
  }  

  var List = opts.list
    , validKeys = opts.validKeys;

  List.schema.statics.findOrCreate = function _findOrCreate(doc){
    var self = this
      , deferred = Q.defer()
      , _doc = _.extend({ "_id": null }, _.pick(doc, '_id'))
      , q;

    q = self.findOne(_doc);

    q.exec().then(function(item){
      var _deferred = Q.defer();

      if (!item){
        doc = _.pick(doc, validKeys);
        self.create(doc, function (err, _item){
          if (err){
            return _deferred.reject(err);
          } else {
            return _deferred.resolve(_item);
          }
        });
      } else {
        _deferred.resolve(item); 
      }

      return _deferred.promise;
    }, function (err){
      deferred.reject(err);
    }).then(function (item){
      deferred.resolve(item); 
    }, function (err){
      deferred.reject(err);
    });

    return deferred.promise;
  };

  return List;
}

exports = module.exports = {
  findOrCreate: {
    add: _addFindOrCreate
  }
};