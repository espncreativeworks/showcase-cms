var keystone = require('keystone')
  , Types = keystone.Field.Types
  , meta = require('../lib/meta')
  , methods = require('../lib/methods');


/**
 * Platform Model
 * ==========
 */

var Platform = new keystone.List('Platform', {
  autokey: { path: 'slug', from: 'name', unique: true },
  track: true,
  searchFields: 'name, meta.keywords'
});

Platform.add({
  name: { type: String, required: true },
  description: {
    brief: { type: Types.Markdown, collapse: true },
    extended: { type: Types.Markdown, collapse: true }
  },
  status: { type: Types.Select, options: 'draft, published, archived', default: 'draft', index: true },
  related: { type: Types.Relationship, ref: 'Platform', many: true, collapse: true }
}, 'Images', {
  icon: { type: Types.Relationship, ref: 'Image', filters: { usage: 'icon' }, collapse: true },
  hero: { type: Types.Relationship, ref: 'Image', filters: { usage: 'hero' }, collapse: true }
});

meta.add({ list: Platform });


// Virtuals
// ------------------------------


// Methods
// ------------------------------

methods.toJSON.set({ 
  list: Platform
});

Platform.defaultColumns = 'name, status, meta.publishedAt';
Platform.register();


