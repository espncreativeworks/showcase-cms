var keystone = require('keystone')
  , methods = require('../lib/methods');


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

methods.toJSON.set({ 
  list: VideoTag
});


// Relationships
// ------------------------------

VideoTag.relationship({ ref: 'Video', path: 'tags' });


// Registration
// ------------------------------

VideoTag.register();
