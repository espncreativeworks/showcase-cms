var keystone = require('keystone')
  , _ = require('underscore');

/**
 * ExecutionTag Model
 * ==================
 */

var ExecutionTag = new keystone.List('ExecutionTag', {
  autokey: { from: 'name', path: 'key', unique: true }
});

ExecutionTag.add({
  name: { type: String, required: true }
});

// Methods
// ------------------------------

ExecutionTag.schema.set('toJSON', {
  transform: function(doc) {
    return _.omit(doc, '__v');
  }
});

ExecutionTag.relationship({ ref: 'Execution', path: 'tags' });
ExecutionTag.register();
