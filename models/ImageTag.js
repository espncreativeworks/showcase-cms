var keystone = require('keystone')
  , _ = require('underscore');

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

ImageTag.schema.set('toJSON', {
  transform: function(doc) {
    return _.omit(doc, '__v');
  }
});

ImageTag.relationship({ ref: 'Image', path: 'tags' });
ImageTag.register();
