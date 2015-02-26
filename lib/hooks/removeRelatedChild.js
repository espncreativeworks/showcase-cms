var keystone = require('keystone')
  , Types = keystone.Field.Types
  , async = require('async');

/**
 * Adds a 'post' hook on 'remove' to remove 
 * deleted item from related models
 *
 * @param {Object} opts
 * @api public
 */

function _add (opts){
  var List = opts.list
    , relatedLists = opts.related
    , path = opts.path
    , relatedModels = []
    , asyncTasks = []
    , asyncCallback;

  asyncCallback = function _asyncCallback (err){
    if (err){
      console.error(err);
    } 
  };

  List.schema.post('remove', function (doc){
    var listItem = doc;

    relatedLists.forEach(function (listKey){
      relatedModels.push(keystone.list(listKey).model);
    });

    relatedModels.forEach(function (Model){
      var task = function _task(done){
        
        Model.find().where(path, listItem._id).exec().then(function (docs){
          docs.forEach(function (_doc){
            _doc.remove(function (err){
              if (err) {
                return done(err);
              } else {
                done();
              }
            });
          });
        }, function (err){
          return done(err);
        });
      }

      asyncTasks.push(task);

    });

    async.parallel(asyncTasks, asyncCallback);

  });

}

exports = module.exports = {
  add: _add
};