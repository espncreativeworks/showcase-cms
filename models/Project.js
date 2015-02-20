var keystone = require('keystone')
  , Types = keystone.Field.Types
  , _ = require('underscore')
  , meta = require('../lib/meta');

/**
 * Project Model
 * ==========
 */

var Project = new keystone.List('Project', {
  map: { name: 'title' },
  autokey: { path: 'slug', from: 'title', unique: true },
  track: true
});

Project.add({
  title: { type: String, required: true },
  tagline: { type: String },
  description: {
    brief: { type: Types.Markdown },
    extended: { type: Types.Markdown }
  },
  status: { type: Types.Select, options: 'draft, published, archived', default: 'draft', index: true },
  highlights: { type: Types.Markdown },
  brands: { type: Types.Relationship, ref: 'Brand', many: true },
  executions: { type: Types.Relationship, ref: 'Execution', many: true },
  sports: { type: Types.Relationship, ref: 'Sport', many: true },
  related: { type: Types.Relationship, ref: 'Project', many: true }
}, 'Images', {
  hero: { type: Types.Relationship, ref: 'Image', filters: { usage: 'hero' } },
  thumbnail: { type: Types.Relationship, ref: 'Image', filters: { usage: 'thumbnail' } },
  logo: { type: Types.Relationship, ref: 'Image', filters: { usage: 'logo' } }
});

meta.add({ list: Project });

// Virtuals
// ------------------------------


// Methods
// ------------------------------

Project.schema.set('toJSON', {
  transform: function(doc, ret, options) {
    return _.omit(ret, '__v', 'name');
  }
});

Project.defaultColumns = 'title, status|20%, meta.publishedAt';
Project.register();


