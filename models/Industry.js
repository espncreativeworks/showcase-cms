var keystone = require('keystone')
  , Types = keystone.Field.Types
  , meta = require('../lib/meta')
  , methods = require('../lib/methods');

/**
 * Industry Model
 * ==========
 */

var Industry = new keystone.List('Industry', {
  autokey: { path: 'slug', from: 'name', unique: true },
  sortable: true
});

Industry.add({
  name: { type: String, required: true },
  description: {
    brief: { type: Types.Markdown, collapse: true },
    extended: { type: Types.Markdown, collapse: true }
  },
  status: { type: Types.Select, options: 'draft, published, archived', default: 'draft', index: true },
  related: { type: Types.Relationship, ref: 'Industry', many: true, collapse: true }
}, 'Images', {
  icon: { type: Types.Relationship, ref: 'Image', collapse: true }
});

meta.add({ list: Industry });


methods.toJSON.set({ 
  list: Industry
});

Industry.defaultColumns = 'name, status, meta.publishedAt';
Industry.register();


