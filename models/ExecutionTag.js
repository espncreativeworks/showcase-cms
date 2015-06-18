var keystone = require('keystone')
  , Types = keystone.Field.Types
  , methods = require('../lib/methods')
  , removeFromRelated = require('../lib/hooks/removeFromRelated')
  , listUrls = keystone.get('list urls');

/**
 * ExecutionTag Model
 * ==================
 */

var ExecutionTag = new keystone.List('ExecutionTag', {
  autokey: { from: 'name', path: 'key', unique: true }
});

ExecutionTag.add({
  name: { type: String, required: true, initial: true },
  platform: { type: Types.Relationship, ref: 'Platform', required: true, initial: true, note: 'See [platforms](' + listUrls.platform + ')' }
});

// Methods
// ------------------------------

methods.toJSON.set({ 
  list: ExecutionTag
});


// Post Remove
// ------------------------------

removeFromRelated.add({ 
  list: ExecutionTag, 
  related: [ 'Execution' ],
  path: 'tags'
});


ExecutionTag.relationship({ ref: 'Execution', path: 'tags' });
ExecutionTag.defaultColumns = 'name, platform';
ExecutionTag.register();
