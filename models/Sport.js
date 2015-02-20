var keystone = require('keystone')
  , Types = keystone.Field.Types
  , _ = require('underscore')
  , meta = require('../lib/meta');


/**
 * Sport Model
 * ==========
 */

var Sport = new keystone.List('Sport', {
  autokey: { path: 'slug', from: 'name', unique: true }
});

Sport.add({
  name: { type: String, required: true },
  description: {
    brief: { type: Types.Markdown },
    extended: { type: Types.Markdown }
  },
  status: { type: Types.Select, options: 'draft, published, archived', default: 'draft', index: true },
  related: { type: Types.Relationship, ref: 'Sport', many: true }
}, 'Images', {
  hero: { type: Types.Relationship, ref: 'Image', filters: { usage: 'hero' } },
  thumbnail: { type: Types.Relationship, ref: 'Image', filters: { usage: 'thumbnail' } },
  logo: { type: Types.Relationship, ref: 'Image', filters: { usage: 'logo' } },
  icon: { type: Types.Relationship, ref: 'Image', filters: { usage: 'icon' } }
});

meta.add({ list: Sport });


// Virtuals
// ------------------------------


// Methods
// ------------------------------

Sport.schema.set('toJSON', {
  transform: function(doc) {
    return _.omit(doc, '__v');
  }
});


// Registration
// ------------------------------

Sport.defaultColumns = 'name, status, publishedAt';
Sport.register();


