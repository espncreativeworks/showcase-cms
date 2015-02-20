var keystone = require('keystone')
  , Types = keystone.Field.Types;

/**
 * Adds a 'social' field to the List
 * Based on Mongoose's Schema.add
 *
 * @param {Object} opts
 * @api public
 */

function _add (opts){
  var List = opts.list
    , title = opts.title || 'Social Media';

  List.add(title, {
    social: {
      twitter: {
        name: { type: Types.Text, label: 'Twitter', note: 'without the \'@\'; e.g., jmanziel2' }
      }, 
      facebook: {
        name: { type: Types.Text, label: 'Facebook', note: 'e.g., JManziel2' }
      },
      instagram: {
        name: { type: Types.Text, label: 'Instagram', note: 'without the \'@\'; e.g., jmanziel2' }
      }
    }
  });

  return List;
}

exports = module.exports = {
  add: _add
};