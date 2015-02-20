var keystone = require('keystone')
  , Types = keystone.Field.Types
  , _ = require('underscore')
  , meta = require('../lib/meta');


/**
 * Platform Model
 * ==========
 */

var Platform = new keystone.List('Platform', {
  autokey: { path: 'slug', from: 'name', unique: true }
});

Platform.add({
  name: { type: String, required: true },
  description: {
    brief: { type: Types.Markdown },
    extended: { type: Types.Markdown }
  },
  status: { type: Types.Select, options: 'draft, published, archived', default: 'draft', index: true },
  related: { type: Types.Relationship, ref: 'Platform', many: true }
}, 'Images', {
  icon: { type: Types.Relationship, ref: 'Image', filters: { usage: 'icon' } },
  hero: { type: Types.Relationship, ref: 'Image', filters: { usage: 'hero' } }
});

meta.add({ list: Platform });


// Virtuals
// ------------------------------


// Methods
// ------------------------------

Platform.schema.set('toJSON', {
  transform: function(doc) {
    return _.omit(doc, '__v');
  }
});

Platform.defaultColumns = 'name, status, publishedAt';
Platform.register();


