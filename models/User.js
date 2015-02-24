var keystone = require('keystone')
	, Types = keystone.Field.Types
  , meta = require('../lib/meta')
  , social = require('../lib/social')
  , statics = require('../lib/statics')
  , methods = require('../lib/methods');


/**
 * User Model
 * ==========
 */

var User = new keystone.List('User', {
  autokey: { path: 'slug', from: 'name', unique: true }
});

User.add({
	name: { type: Types.Name, required: true, index: true },
	email: { type: Types.Email, initial: true, required: true, index: true },
	password: { type: Types.Password, initial: true, required: true }
}, 'Permissions', {
	isAdmin: { type: Boolean, label: 'Can access Keystone', index: true }
});

meta.add({ list: User });
social.add({ list: User });

// Statics
// ------------------------------

statics.findOrCreate.add({ 
  list: User, 
  validKeys: [ 'name', 'email', 'meta', 'social' ] 
});


// Virtuals
// ------------------------------

// Provide access to Keystone
User.schema.virtual('canAccessKeystone').get(function() {
	return this.isAdmin;
});


// Methods
// ------------------------------

methods.toJSON.set({ 
  list: User,
  omit: ['__v', 'password']
});


// Relationships
// ------------------------------

User.relationship({ ref: 'Post', path: 'posts', refPath: 'author' });



// Registration
// ------------------------------

User.defaultColumns = 'name, email, isAdmin, meta.publishedAt';
User.register();
