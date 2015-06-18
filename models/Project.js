var keystone = require('keystone')
  , Types = keystone.Field.Types
  , meta = require('../lib/meta')
  , methods = require('../lib/methods')
  , listUrls = keystone.get('list urls');

/**
 * Project Model
 * ==========
 */

var Project = new keystone.List('Project', {
  map: { name: 'title' },
  autokey: { path: 'slug', from: 'title', unique: true },
  track: true,
  searchFields: 'name, tagline, meta.keywords',
  sortable: true
});

Project.add({
  title: { type: String, required: true },
  tagline: { type: String },
  startDate: { type: Types.Date },
  endDate: { type: Types.Date },
  description: {
    brief: { type: Types.Markdown },
    extended: { type: Types.Markdown }
  },
  highlights: { type: Types.Markdown },
  status: { type: Types.Select, options: 'draft, published, archived', default: 'draft', index: true },
  isFeatured: { type: Types.Boolean, default: false },
  brands: { type: Types.Relationship, ref: 'Brand', many: true, note: 'See [brands](' + listUrls.brand + ')'},
  executions: { type: Types.Relationship, ref: 'Execution', many: true, note: 'See [executions](' + listUrls.execution + ')'},
  sports: { type: Types.Relationship, ref: 'Sport', many: true, note: 'See [sports](' + listUrls.sport + ')'},
  related: { type: Types.Relationship, ref: 'Project', many: true }
}, 'Images', {
  hero: { type: Types.Relationship, ref: 'Image', filters: { usage: 'hero' }, note: 'See [images](' + listUrls.image + ')'},
  thumbnail: { type: Types.Relationship, ref: 'Image', filters: { usage: 'thumbnail' }, collapse: true },
  logo: { type: Types.Relationship, ref: 'Image', filters: { usage: 'logo' }, collapse: true }
});

meta.add({ list: Project });

// Virtuals
// ------------------------------


// Methods
// ------------------------------

methods.toJSON.set({ 
  list: Project
});

Project.defaultColumns = 'title, status, startDate, endDate, meta.publishedAt';
Project.register();


