var keystone = require('keystone')
  , Types = keystone.Field.Types
  , meta = require('../lib/meta')
  , removeFromRelated = require('../lib/hooks/removeFromRelated')
  , removeRelatedChild = require('../lib/hooks/removeRelatedChild')
  , statics = require('../lib/statics')
  , methods = require('../lib/methods');

/**
 * Collection Model
 * ==========
 */

var Collection = new keystone.List('Collection', {
  map: { name: 'title' },
  autokey: { path: 'slug', from: 'title', unique: true },
  track: true,
  searchFields: 'title, creator.name, creator.email'
});

Collection.add({
  title: { type: Types.Text, required: true },
  creator: { type: Types.Relationship, ref: 'Account' }, 
  items: { type: Types.Relationship, ref: 'CollectionItem', many: true, filters: { belongsTo: ':_id' } },
  status: { type: Types.Select, options: 'draft, published, archived', default: 'draft', index: true },
  visibility: { type: Types.Select, options: 'public, private', default: 'public', index: true }
});

meta.add({ list: Collection });

// Virtuals
// ------------------------------

// Post Remove
// ------------------------------

removeFromRelated.add({ 
  list: Collection, 
  related: [ 'Account' ],
  path: 'collections'
});

removeRelatedChild.add({ 
  list: Collection, 
  related: [ 'CollectionItem' ],
  path: 'belongsTo'
});

// Statics
// ------------------------------

statics.findOrCreate.add({ 
  list: Collection, 
  validKeys: [ 'title', 'creator', 'items', 'visibility' ] 
});

// Methods
// ------------------------------

methods.toJSON.set({ 
  list: Collection
});

Collection.defaultSort = '-createdAt';
Collection.defaultColumns = 'title, creator, modifiedAt';
Collection.register();


