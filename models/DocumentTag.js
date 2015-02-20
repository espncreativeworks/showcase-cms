var keystone = require('keystone')
  , _ = require('underscore');


/**
 * DocumentTag Model
 * ==================
 */

var DocumentTag = new keystone.List('DocumentTag', {
  autokey: { from: 'name', path: 'key', unique: true }
});

DocumentTag.add({
  name: { type: String, required: true }
});

// Methods
// ------------------------------

DocumentTag.schema.set('toJSON', {
  transform: function(doc) {
    return _.omit(doc, '__v');
  }
});

DocumentTag.relationship({ ref: 'Document', path: 'tags' });

DocumentTag.defaultColumns = 'name, status';
DocumentTag.register();
