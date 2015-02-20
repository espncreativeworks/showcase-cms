var keystone = require('keystone')
  , _ = require('underscore');


/**
 * VideoTag Model
 * ==================
 */

var VideoTag = new keystone.List('VideoTag', {
  autokey: { from: 'name', path: 'key', unique: true },
  track: true,
  searchFields: 'name'
});

VideoTag.add({
  name: { type: String, required: true }
});


// Methods
// ------------------------------

VideoTag.schema.set('toObject', {
  virtuals: true
});

VideoTag.schema.set('toJSON', {
  virtuals: true,
  transform: function(doc) {
    return _.pick(doc, '_id', 'name', 'key');
  }
});


// Relationships
// ------------------------------

VideoTag.relationship({ ref: 'Video', path: 'tags' });


// Registration
// ------------------------------

VideoTag.register();
