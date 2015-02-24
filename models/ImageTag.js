var keystone = require('keystone')
  , methods = require('../lib/methods');

/**
 * ImageTag Model
 * ==================
 */

var ImageTag = new keystone.List('ImageTag', {
 autokey: { from: 'name', path: 'key', unique: true }
});

ImageTag.add({
  name: { type: String, required: true }
});

// Methods
// ------------------------------

methods.toJSON.set({ 
  list: ImageTag
});

ImageTag.relationship({ ref: 'Image', path: 'tags' });
ImageTag.register();
