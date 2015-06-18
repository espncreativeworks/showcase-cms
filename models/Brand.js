var keystone = require('keystone')
  , Types = keystone.Field.Types
  , meta = require('../lib/meta')
  , social = require('../lib/social')
  , removeFromRelated = require('../lib/hooks/removeFromRelated')
  , statics = require('../lib/statics')
  , methods = require('../lib/methods')
  , listUrls = keystone.get('list urls');


/**
 * Brand Model
 * ==========
 */

var Brand = new keystone.List('Brand', {
  autokey: { path: 'slug', from: 'name', unique: true },
  sortable: true,
  track: true,
  searchFields: 'name, homepage, meta.keywords'
});

Brand.add({
  name: { type: String, required: true },
  homepage: { type: Types.Url, collapse: true },
  description: {
    brief: { type: Types.Markdown, collapse: true },
    extended: { type: Types.Markdown, collapse: true }
  },
  status: { type: Types.Select, options: 'draft, published, archived', default: 'draft', index: true },
  industries: { type: Types.Relationship, ref: 'Industry', many: true, note: 'See [industries](' + listUrls.industry + ')' },
  related: { type: Types.Relationship, ref: 'Brand', many: true, collapse: true }
}, 'Images', {
  hero: { type: Types.Relationship, ref: 'Image', filters: { usage: 'hero' }, collapse: true },
  thumbnail: { type: Types.Relationship, ref: 'Image', filters: { usage: 'thumbnail' }, collapse: true },
  logo: { type: Types.Relationship, ref: 'Image', filters: { usage: 'logo' }, collapse: true }
});

meta.add({ list: Brand });
social.add({ list: Brand });


// Virtuals
// ------------------------------


// Statics
// ------------------------------

statics.findOrCreate.add({ 
  list: Brand, 
  validKeys: [ 'name', 'homepage', 'description', 'status', 'industries', 'related' ] 
});


// Pre Save
// ------------------------------

Brand.schema.pre('save', function (next) {
  this.wasNew = this.isNew;
  next();
});


// Post Remove
// ------------------------------

removeFromRelated.add({ 
  list: Brand, 
  related: [ 'Project' ],
  path: 'brands'
});


// Methods
// ------------------------------

methods.toJSON.set({ 
  list: Brand
});


// Registration
// ------------------------------

Brand.defaultColumns = 'name, status, meta.publishedAt';
Brand.register();


