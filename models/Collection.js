var keystone = require('keystone')
  , Types = keystone.Field.Types
  , meta = require('../lib/meta')
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
  items: { type: Types.Relationship, ref: 'CollectionItem', many: true },
  status: { type: Types.Select, options: 'draft, published, archived', default: 'draft', index: true },
  visibility: { type: Types.Select, options: 'public, private', default: 'public', index: true }
});

meta.add({ list: Collection });

// Virtuals
// ------------------------------


// Methods
// ------------------------------

methods.toJSON.set({ 
  list: Collection
});

Collection.defaultColumns = 'title, creator, createdAt';
Collection.register();


