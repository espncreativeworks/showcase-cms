var keystone = require('keystone')
  , Types = keystone.Field.Types
  , meta = require('../lib/meta')
  , methods = require('../lib/methods');

/**
 * Channel Model
 * ==========
 */

var Channel = new keystone.List('Channel', {
  autokey: { path: 'slug', from: 'name', unique: true }
});

Channel.add({
  name: { type: String, required: true },
  homepage: { type: Types.Url, collapse: true },
  description: {
    brief: { type: Types.Markdown, collapse: true },
    extended: { type: Types.Markdown, collapse: true }
  },
  status: { type: Types.Select, options: 'draft, published, archived', default: 'draft', index: true },
  related: { type: Types.Relationship, ref: 'Channel', many: true, collapse: true }
}, 'Images', {
  hero: { type: Types.Relationship, ref: 'Image', filters: { usage: 'hero' }, collapse: true },
  thumbnail: { type: Types.Relationship, ref: 'Image', filters: { usage: 'thumbnail' }, collapse: true },
  logo: { type: Types.Relationship, ref: 'Image', filters: { usage: 'logo' }, collapse: true },
  icon: { type: Types.Relationship, ref: 'Image', filters: { usage: 'icon' }, collapse: true }
});

meta.add({ list: Channel });


// Methods
// ------------------------------

methods.toJSON.set({ 
  list: Channel
});

Channel.defaultColumns = 'name, status, meta.publishedAt';
Channel.register();


