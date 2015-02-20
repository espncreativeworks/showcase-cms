var keystone = require('keystone')
  , Types = keystone.Field.Types
  , _ = require('underscore')
  , meta = require('../lib/meta');

/**
 * Document Model
 * ==========
 */

var _Document = new keystone.List('Document', {
  map: { name: 'title' },
  autokey: { path: 'slug', from: 'title', unique: true }
});

_Document.add({
  file: { 
    type: Types.S3File, 
    s3path: 'documents',
    allowedTypes: ['application/pdf'],
    filename: function (item, filename){
      // prefix file name with object id
      var ext = filename.replace(/.*[\.\/\\]/, '').toLowerCase();
      return item._id + '/' + item.slug + '.' + ext;
    }
  },
  title: { type: String, required: true, initial: true },
  description: {
    brief: { type: Types.Markdown },
    extended: { type: Types.Markdown }
  },
  usage: { type: Types.Select, options: 'execution, email, other', default: 'execution', required: true, initial: true, index: true },
  platform: { type: Types.Relationship, ref: 'Platform', dependsOn: { usage: 'execution' } },
  thumbnail: { type: Types.Relationship, ref: 'Image', filters: { usage: 'thumbnail' } },
  status: { type: Types.Select, options: 'draft, published, archived', default: 'draft', index: true },
  people: { type: Types.Relationship, ref: 'Person', many: true },
  tags: { type: Types.Relationship, ref: 'DocumentTag', many: true },
  related: { type: Types.Relationship, ref: 'Document', many: true }
});

meta.add({ list: _Document });


// Methods
// ------------------------------

_Document.schema.set('toJSON', {
  transform: function(doc) {
    return _.omit(doc, '__v');
  }
});

_Document.defaultColumns = 'title, usage, status, meta.publishedAt';
_Document.register();


