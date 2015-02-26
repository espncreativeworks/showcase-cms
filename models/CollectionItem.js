var keystone = require('keystone')
  , Types = keystone.Field.Types
  , removeFromRelated = require('../lib/hooks/removeFromRelated')
  , statics = require('../lib/statics')
  , methods = require('../lib/methods');

/**
 * CollectionItem Model
 * ==========
 */

var CollectionItem = new keystone.List('CollectionItem', {
  track: true,
  searchFields: 'belongsTo, execution, notes'
});

CollectionItem.add({
  belongsTo: { type: Types.Relationship, ref: 'Collection', label: 'Collection' }, 
  execution: { type: Types.Relationship, ref: 'Execution' },
  notes: { type: Types.Textarea }
});

// Virtuals
// ------------------------------


// Post Remove
// ------------------------------

removeFromRelated.add({ 
  list: CollectionItem, 
  related: [ 'Collection' ],
  path: 'items'
});

// Statics
// ------------------------------

statics.findOrCreate.add({ 
  list: CollectionItem, 
  validKeys: [ 'belongsTo', 'execution', 'notes' ] 
});


// Methods
// ------------------------------

methods.toJSON.set({ 
  list: CollectionItem
});

CollectionItem.defaultSort = '-createdAt';
CollectionItem.defaultColumns = '_id, belongsTo, execution, notes';
CollectionItem.register();


