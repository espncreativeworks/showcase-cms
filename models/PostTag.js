var keystone = require('keystone')
  , methods = require('../lib/methods');

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

methods.toJSON.set({ 
  list: PostTag
});

PostTag.relationship({ ref: 'Post', path: 'tags' });
PostTag.register();
