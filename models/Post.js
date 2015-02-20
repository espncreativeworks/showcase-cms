var keystone = require('keystone')
	, Types = keystone.Field.Types
  , _ = require('underscore')
  , meta = require('../lib/meta');


/**
 * Post Model
 * ==========
 */

var Post = new keystone.List('Post', {
	map: { name: 'title' },
	autokey: { path: 'slug', from: 'title', unique: true }
});

Post.add({
	title: { type: String, required: true },
	author: { type: Types.Relationship, ref: 'User', index: true },
	body: {
		brief: { type: Types.Markdown },
		extended: { type: Types.Markdown }
	},
  status: { type: Types.Select, options: 'draft, published, archived', default: 'draft', index: true },
  related: { type: Types.Relationship, ref: 'Post', many: true },
	tags: { type: Types.Relationship, ref: 'PostTag', many: true }
}, 'Images', {
  hero: { type: Types.Relationship, ref: 'Image', filters: { usage: 'hero' } },
  thumbnail: { type: Types.Relationship, ref: 'Image', filters: { usage: 'thumbnail' } },
  logo: { type: Types.Relationship, ref: 'Image', filters: { usage: 'logo' } }
});

meta.add({ list: Post });


// Virtuals
// ------------------------------


// Methods
// ------------------------------

Post.schema.set('toJSON', {
  transform: function(doc) {
    return _.omit(doc, '__v');
  }
});


// Registration
// ------------------------------

Post.defaultColumns = 'title, state|20%, author|20%';
Post.register();
