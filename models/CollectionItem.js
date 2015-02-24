var keystone = require('keystone')
  , Types = keystone.Field.Types
  , meta = require('../lib/meta')
  , methods = require('../lib/methods');

/**
 * CollectionItem Model
 * ==========
 */

var CollectionItem = new keystone.List('CollectionItem', {
  track: true,
  searchFields: 'notes, execution.name'
});

CollectionItem.add({
  execution: { type: Types.Relationship, ref: 'Execution' },
  notes: { type: Types.Textarea }
});

meta.add({ list: CollectionItem });

// Virtuals
// ------------------------------


// Methods
// ------------------------------

methods.toJSON.set({ 
  list: CollectionItem
});

CollectionItem.defaultColumns = 'execution, notes';
CollectionItem.register();


