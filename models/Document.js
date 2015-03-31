var keystone = require('keystone')
  , Types = keystone.Field.Types
  , meta = require('../lib/meta')
  , methods = require('../lib/methods')
  , removeFromRelated = require('../lib/hooks/removeFromRelated')
  , _ = require('underscore');

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
  execution: { type: Types.Relationship, ref: 'Execution', dependsOn: { usage: 'execution' } },
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

methods.toJSON.set({ 
  list: _Document
});

// Pre Save
// ------------------------------

// TODO: refactor to abstracted module
_Document.schema.pre('save', function(next) {
  var _document = this
    , Execution = keystone.list('Execution').model
    , q;

  // if _document is an execution and the execution has been set...
  if (_document.usage === 'execution' && _document.execution){
    q = Execution.findOne({ _id: _document.execution });
    q.exec().then(function (execution){
      // if the _document isn't assigned to the execution.videos, add it
      var _documentIds = _.map(execution.documents, function (_documentId){
        return _documentId.toString();
      });

      if (!_.contains(_documentIds, _document._id.toString())){
        execution.documents.push(_document._id);
        execution.save(function (err){
          if (err){
            return next(err);
          } 
          next()
        });
      } else {
        next();
      }
    }, function (err){
      next(err);
    });
  } else {
    next();
  }
});


// Post Remove
// ------------------------------

removeFromRelated.add({ 
  list: _Document, 
  related: [ 'Execution', 'CollectionItem' ],
  path: 'documents'
});


_Document.defaultColumns = 'title, usage, status, meta.publishedAt';
_Document.register();


