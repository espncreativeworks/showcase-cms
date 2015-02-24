var keystone = require('keystone')
  , methods = require('../lib/methods');


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

methods.toJSON.set({ 
  list: DocumentTag
});

DocumentTag.relationship({ ref: 'Document', path: 'tags' });

DocumentTag.defaultColumns = 'name, status';
DocumentTag.register();
