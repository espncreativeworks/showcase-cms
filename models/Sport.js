var keystone = require('keystone')
  , Types = keystone.Field.Types
  , meta = require('../lib/meta')
  , methods = require('../lib/methods');


/**
 * Sport Model
 * ==========
 */

var Sport = new keystone.List('Sport', {
  autokey: { path: 'slug', from: 'name', unique: true },
  track: true,
  sortable: true,
  searchFields: 'name, meta.keywords'
});

Sport.add({
  name: { type: String, required: true },
  description: {
    brief: { type: Types.Markdown, collapse: true },
    extended: { type: Types.Markdown, collapse: true }
  },
  status: { type: Types.Select, options: 'draft, published, archived', default: 'draft', index: true },
  related: { type: Types.Relationship, ref: 'Sport', many: true, collapse: true }
}, 'Images', {
  hero: { type: Types.Relationship, ref: 'Image', filters: { usage: 'hero' }, collapse: true },
  thumbnail: { type: Types.Relationship, ref: 'Image', filters: { usage: 'thumbnail' }, collapse: true },
  logo: { type: Types.Relationship, ref: 'Image', filters: { usage: 'logo' }, collapse: true },
  icon: { type: Types.Relationship, ref: 'Image', filters: { usage: 'icon' }, collapse: true }
});

meta.add({ list: Sport });


// Virtuals
// ------------------------------


// Methods
// ------------------------------

methods.toJSON.set({ 
  list: Sport
});


// Registration
// ------------------------------

Sport.defaultColumns = 'name, status, meta.publishedAt';
Sport.register();


