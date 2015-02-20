var keystone = require('keystone')
  , _ = require('underscore');

/**
 * PostTag Model
 * ==================
 */

var PostTag = new keystone.List('PostTag', {
	autokey: { from: 'name', path: 'key', unique: true }
});

PostTag.add({
	name: { type: String, required: true }
});

// Methods
// ------------------------------

PostTag.schema.set('toJSON', {
  transform: function(doc) {
    return _.omit(doc, '__v');
  }
});

PostTag.relationship({ ref: 'Post', path: 'tags' });
PostTag.register();
