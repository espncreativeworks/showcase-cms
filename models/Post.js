var keystone = require('keystone')
	, Types = keystone.Field.Types
  , meta = require('../lib/meta')
  , methods = require('../lib/methods');


/**
 * Post Model
 * ==========
 */

var Post = new keystone.List('Post', {
	map: { name: 'title' },
	autokey: { path: 'slug', from: 'title', unique: true },
  track: true,
  searchFields: 'name, meta.keywords'
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

methods.toJSON.set({ 
  list: Post
});


// Registration
// ------------------------------

Post.defaultColumns = 'title, state|20%, meta.publishedAt';
Post.register();
