var _ = require('underscore');

/**
 * Adds a 'toJSON' method to the List's schema
 *
 * @param {Object} opts
 * @api public
 */

function _setToJSON (opts){
  if (!_.has(opts, 'list')){
    throw new Error('Invalid opts: \'list\' is required');
  }

  //console.log(opts);

  var List = opts.list
    // , _omit = opts.omit || ['__v', 'createdBy', 'createdAt', 'updatedBy', 'updatedAt']
    , _omit = opts.omit || ['__v']
    , _virtuals = opts.virtuals || false;

  // console.log(List);

  List.schema.set('toJSON', {
    virtuals: _virtuals,
    transform: function (doc, ret, options){
      var paths = ['_id', 'slug', 'key']
        , json = {};

      _.each(_.keys(List.schema.paths), function (key){
        // console.log(key);
        if (key.indexOf('.') > -1){
          key = key.split('.')[0];
        }
        if (_omit.indexOf(key) === -1){
          if (paths.indexOf(key) === -1){
            paths.push(key);
          }
        }
      });

      // console.log(paths);

      json = _.pick(doc, paths);
      // console.log(json);
      return json;
    }
  });

  return List;
}

exports = module.exports = {
  toJSON: {
    set: _setToJSON
  }
};