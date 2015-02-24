var keystone = require('keystone')
  , methods = require('../lib/methods');


/**
 * Timezone Model
 * ==================
 */

var Timezone = new keystone.List('Timezone', {
  autokey: { from: 'name', path: 'slug', unique: true },
  hidden: true,
  nocreate: true,
  noedit: true,
  nodelete: true
});

Timezone.add({
  name: { type: String, required: true, initial: false },
  group: { type: String, required: true, index: true, initial: false },
  code: { type: String, required: true, index: true, initial: false }
});


// Methods
// ------------------------------

methods.toJSON.set({ 
  list: Timezone
});


// Registration
// ------------------------------

Timezone.defaultColumns = 'name, group, code';
Timezone.register();
