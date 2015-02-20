var keystone = require('keystone')
  , Types = keystone.Field.Types
  , _ = require('underscore')
  , meta = require('../lib/meta');

/**
 * Channel Model
 * ==========
 */

var Channel = new keystone.List('Channel', {
  autokey: { path: 'slug', from: 'name', unique: true }
});

Channel.add({
  name: { type: String, required: true },
  homepage: { type: Types.Url },
  description: {
    brief: { type: Types.Markdown },
    extended: { type: Types.Markdown }
  },
  status: { type: Types.Select, options: 'draft, published, archived', default: 'draft', index: true },
  related: { type: Types.Relationship, ref: 'Channel', many: true }
}, 'Images', {
  hero: { type: Types.Relationship, ref: 'Image', filters: { usage: 'hero' } },
  thumbnail: { type: Types.Relationship, ref: 'Image', filters: { usage: 'thumbnail' } },
  logo: { type: Types.Relationship, ref: 'Image', filters: { usage: 'logo' } },
  icon: { type: Types.Relationship, ref: 'Image', filters: { usage: 'icon' } }
});

meta.add({ list: Channel });


// Methods
// ------------------------------

Channel.schema.set('toJSON', {
  transform: function(doc) {
    return _.omit(doc, '__v');
  }
});

Channel.defaultColumns = 'name, status, meta.publishedAt';
Channel.register();


