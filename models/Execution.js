var keystone = require('keystone')
  , Types = keystone.Field.Types
  , meta = require('../lib/meta')
  , methods = require('../lib/methods')
  , removeRelatedChild = require('../lib/hooks/removeRelatedChild');

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
    extended: { type: Types.Markdown }
  },
  status: { type: Types.Select, options: 'draft, published, archived', default: 'draft', index: true },
  platform: { type: Types.Relationship, ref: 'Platform' },
  tags: { type: Types.Relationship, ref: 'ExecutionTag', many: true, filters: { platform: ':platform' } },
  related: { type: Types.Relationship, ref: 'Execution', many: true }
}, 'Content', {
  images: { type: Types.Relationship, ref: 'Image', filters: { usage: 'execution', platform: ':platform' }, many: true },
  videos: { type: Types.Relationship, ref: 'Video', filters: { usage: 'execution', platform: ':platform' }, many: true },
  documents: { type: Types.Relationship, ref: 'Document', filters: { usage: 'execution', platform: ':platform' }, many: true }
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

Execution.defaultColumns = 'name, status, meta.publishedAt';
Execution.register();