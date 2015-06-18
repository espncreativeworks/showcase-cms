var keystone = require('keystone')
  , Types = keystone.Field.Types
  , meta = require('../lib/meta')
  , methods = require('../lib/methods')
  , removeRelatedChild = require('../lib/hooks/removeRelatedChild')
  , listUrls = keystone.get('list urls');

/**
 * Execution Model
 * ==========
 */

var Execution = new keystone.List('Execution', {
  autokey: { path: 'slug', from: 'name', unique: true },
  sortable: true,
  track: true
});

Execution.add({
  name: { type: String, required: true },
  description: {
    brief: { type: Types.Markdown },
    extended: { type: Types.Markdown, collapse: true }
  },
  status: { type: Types.Select, options: 'draft, published, archived', default: 'draft', index: true },
  platform: { type: Types.Relationship, ref: 'Platform', note: 'See [platforms](' + listUrls.platform + ')' },
  tags: { type: Types.Relationship, ref: 'ExecutionTag', many: true, filters: { platform: ':platform' }, note: 'See [tags](' + listUrls.executionTag + ')' },
  related: { type: Types.Relationship, ref: 'Execution', many: true, collapse: true }
}, 'Content', {
  images: { type: Types.Relationship, ref: 'Image', filters: { usage: 'execution', platform: ':platform' }, many: true, collapse: true, note: 'See [images](' + listUrls.image + ')' },
  videos: { type: Types.Relationship, ref: 'Video', filters: { usage: 'execution', platform: ':platform' }, many: true, collapse: true, note: 'See [videos](' + listUrls.video + ')' },
  documents: { type: Types.Relationship, ref: 'Document', filters: { usage: 'execution', platform: ':platform' }, many: true, collapse: true }
});

meta.add({ list: Execution });

// Methods
// ------------------------------

methods.toJSON.set({ 
  list: Execution
});

// Post Remove
// ------------------------------

removeRelatedChild.add({ 
  list: Execution, 
  related: [ 'Image', 'Video', 'Document' ],
  path: 'execution'
});

Execution.defaultColumns = 'name, platform, status, meta.publishedAt';
Execution.register();