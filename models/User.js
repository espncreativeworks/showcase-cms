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

User.schema.methods.sendNotificationEmail = function (callback) {
  
  if ('function' !== typeof callback) {
    callback = function() {};
  }

  if ('production' === process.env.NODE_ENV) {
    var path
      , user
      , options
      , cms
      , email;

    path = require('path');
    user = this;

    options = {
      templateExt: 'hbs',
      templateEngine: require('handlebars'),
      templateBasePath: path.normalize(path.join(__dirname, '..', 'templates', 'emails')),
      templateName: 'new-user-notification'
    };

    cms = {
      title: process.env.NODE_ENV === 'production' ? 'cms.espncreativeworks.com' : 'showcase-cms-stg.herokuapp.com'
    };

    email = new keystone.Email(options);
    email.send({
      to: user,
      from: {
        name: keystone.get('name'),
        email: 'creativeworks@espn.com'
      },
      subject: 'New Account Created at ' + keystone.get('name'),
      user: user,
      cms: cms
    }, callback);
  } else {
    callback.call();
  }

};


// Pre-validate Hooks
// ------------------------------

User.schema.pre('validate', function(next) {
  this.plainTextPassword = this.password + ''; // make a copy
  next();
});

// Pre-save Hooks
// ------------------------------

User.schema.pre('save', function(next) {
  this.wasNew = this.isNew;
  next();
});

// Post-save Hooks
// ------------------------------

User.schema.post('save', function() {
  if (this.wasNew) {
    this.sendNotificationEmail();
  }
});


// Relationships
// ------------------------------

User.relationship({ ref: 'Post', path: 'posts', refPath: 'author' });



// Registration
// ------------------------------

User.defaultColumns = 'name, email, isAdmin, meta.publishedAt';
User.register();
