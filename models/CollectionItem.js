var keystone = require('keystone')
  , Types = keystone.Field.Types
  , meta = require('../lib/meta')
  , removeFromRelated = require('../lib/hooks/removeFromRelated')
  , statics = require('../lib/statics')
  , methods = require('../lib/methods');

/**
 * CollectionItem Model
 * ==========
 */

var CollectionItem = new keystone.List('CollectionItem', {
  track: true,
  searchFields: 'belongsTo, title, description, images, videos, documents'
});

CollectionItem.add({
  title: { type: Types.Text, required: true },
  description: {
    brief: { type: Types.Markdown },
    extended: { type: Types.Markdown }
  },
  belongsTo: { type: Types.Relationship, ref: 'Collection', label: 'Collection' }, 
  images: { type: Types.Relationship, ref: 'Image', many: true },
  videos: { type: Types.Relationship, ref: 'Video', many: true },
  documents: { type: Types.Relationship, ref: 'Document', many: true }
});

meta.add({ list: CollectionItem });

// Virtuals
// ------------------------------


// Post Remove
// ------------------------------

removeFromRelated.add({ 
  list: CollectionItem, 
  related: [ 'Collection' ],
  path: 'items'
});

// Statics
// ------------------------------

statics.findOrCreate.add({ 
  list: CollectionItem, 
  validKeys: [ 'belongsTo', 'title', 'description', 'videos', 'images', 'documents', 'notes' ] 
});


// Methods
// ------------------------------

methods.toJSON.set({ 
  list: CollectionItem
});

CollectionItem.defaultSort = '-createdAt';
CollectionItem.defaultColumns = '_id, belongsTo, modifiedAt';
CollectionItem.register();


