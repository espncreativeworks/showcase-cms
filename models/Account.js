var keystone = require('keystone')
  , Types = keystone.Field.Types
  , crypto = require('crypto')
  , authTypes = ['github', 'twitter', 'facebook', 'google'];


/**
 * Account Model
 * ==========
 */

var Account = new keystone.List('Account', {
  track: true,
  searchFields: 'name, email, username'
});

Account.add({
  name: { type: Types.Text, initial: true, required: true, index: true },
  email: { type: Types.Email, initial: true, required: true, index: true },
  username: { type: Types.Text },
  role: { type: Types.Select, options: 'guest, account, admin', default: 'account', index: true },
  hashedPassword: { type: Types.Text, hidden: true },
  salt: { type: Types.Text, hidden: true },
  provider: { type: Types.Text },
  collections: { type: Types.Relationship, ref: 'Collection', many: true, filters: { creator: ':_id' } }
});

Account.schema.add({
  facebook: {},
  twitter: {},
  google: {},
  github: {}
});

/**
 * Virtuals
 */
Account.schema
  .virtual('password')
  .set(function(password) {
    this._password = password;
    this.salt = this.makeSalt();
    this.hashedPassword = this.encryptPassword(password);
  })
  .get(function() {
    return this._password;
  });

// Public profile information
Account.schema
  .virtual('profile')
  .get(function() {
    return {
      'name': this.name,
      'role': this.role
    };
  });

// Non-sensitive info we'll be putting in the token
Account.schema
  .virtual('token')
  .get(function() {
    return {
      '_id': this._id,
      'role': this.role
    };
  });

/**
 * Validations
 */

// Validate empty email
Account.schema
  .path('email')
  .validate(function(email) {
    if (authTypes.indexOf(this.provider) !== -1) return true;
    return email.length;
  }, 'Email cannot be blank');

// Validate empty password
Account.schema
  .path('hashedPassword')
  .validate(function(hashedPassword) {
    if (authTypes.indexOf(this.provider) !== -1) return true;
    return hashedPassword.length;
  }, 'Password cannot be blank');

// Validate email is not taken
Account.schema
  .path('email')
  .validate(function(value, respond) {
    var self = this;
    this.constructor.findOne({email: value}, function(err, user) {
      if(err) throw err;
      if(user) {
        if(self.id === user.id) return respond(true);
        return respond(false);
      }
      respond(true);
    });
}, 'The specified email address is already in use.');

var validatePresenceOf = function(value) {
  return value && value.length;
};

/**
 * Pre-save hook
 */
Account.schema
  .pre('save', function(next) {
    if (!this.isNew) return next();

    if (!validatePresenceOf(this.hashedPassword) && authTypes.indexOf(this.provider) === -1)
      next(new Error('Invalid password'));
    else
      next();
  });

/**
 * Methods
 */
Account.schema.methods = {
  /**
   * Authenticate - check if the passwords are the same
   *
   * @param {String} plainText
   * @return {Boolean}
   * @api public
   */
  authenticate: function(plainText) {
    return this.encryptPassword(plainText) === this.hashedPassword;
  },

  /**
   * Make salt
   *
   * @return {String}
   * @api public
   */
  makeSalt: function() {
    return crypto.randomBytes(16).toString('base64');
  },

  /**
   * Encrypt password
   *
   * @param {String} password
   * @return {String}
   * @api public
   */
  encryptPassword: function(password) {
    if (!password || !this.salt) return '';
    var salt = new Buffer(this.salt, 'base64');
    return crypto.pbkdf2Sync(password, salt, 10000, 64).toString('base64');
  }
};

methods.toJSON.set({ 
  list: Account,
  omit: ['__v', 'hashedPassword', 'salt']
});

// Registration
// ------------------------------
Account.defaultSort = '';
Account.defaultColumns = 'name, email, provider, role';
Account.register();
