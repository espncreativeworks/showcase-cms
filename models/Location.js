var keystone = require('keystone')
  , Types = keystone.Field.Types
  , validate = require('mongoose-validator')
  , meta = require('../lib/meta')
  , methods = require('../lib/methods');

var phoneValidators = [
  validate({
    validator: 'isLength',
    passIfEmpty: true,
    arguments: [7, 14],
    message: 'Phone should be between 7 and 14 characters'
  }),
  validate({
    validator: 'matches',
    arguments: /(?:\d{3}|\(\d{3}\))([-\/\.])\d{3}\1\d{4}/,
    message: 'Phone should be of format ###-###-####'
  })
];

/**
 * Location Model
 * ==========
 */

var Location = new keystone.List('Location', {
  autokey: { path: 'slug', from: 'name', unique: true }
});

Location.add({
  name: { type: String, required: true },
  address: { type: Types.Location },
  phone: { type: Types.Text, note: 'e.g., 212-456-3654', validate: phoneValidators },
  email: { type: Types.Email },
  description: {
    brief: { type: Types.Markdown, collapse: true },
    extended: { type: Types.Markdown, collapse: true }
  },
  timezone: { type: Types.Relationship, ref: 'Timezone', filters: { group: 'US (Common)' } },
  status: { type: Types.Select, options: 'draft, published, archived', default: 'draft', index: true }
}, 'Images', {
  hero: { type: Types.Relationship, ref: 'Image', filters: { usage: 'hero' }, collapse: true },
  thumbnail: { type: Types.Relationship, ref: 'Image', filters: { usage: 'thumbnail' }, collapse: true },
  logo: { type: Types.Relationship, ref: 'Image', filters: { usage: 'logo' }, collapse: true }
});

meta.add({ list: Location });


methods.toJSON.set({ 
  list: Location
});

Location.defaultColumns = 'name, address, phone, email, meta.publishedAt';
Location.register();