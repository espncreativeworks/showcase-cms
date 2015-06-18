var keystone = require('keystone')
  , Types = keystone.Field.Types
  , removeFromRelated = require('../lib/hooks/removeFromRelated')
  , meta = require('../lib/meta')
  , methods = require('../lib/methods')
  , _ = require('underscore')
  , listUrls = keystone.get('list urls');

/**
 * Image Model
 * ==========
 */

var _Image = new keystone.List('Image', {
  map: { name: 'title' },
  autokey: { path: 'slug', from: 'title', unique: true },
  sortable: true
});

_Image.add({
  file: { type: Types.CloudinaryImage, autocleanup: true, publicID: 'slug' },
  title: { type: String, required: true, initial: true },
  description: {
    brief: { type: Types.Markdown, collapse: true },
    extended: { type: Types.Markdown, collapse: true }
  },
  status: { type: Types.Select, options: 'draft, published, archived', default: 'draft', index: true },
  caption: { type: Types.Markdown, collapse: true },
  credit: { type: Types.Markdown, collapse: true },
  usage: { type: Types.Select, options: 'icon, cover, execution, headshot, hero, logo, poster, thumbnail, facebook, twitter, other', required: true, initial: true, index: true },
  execution: { type: Types.Relationship, ref: 'Execution', dependsOn: { usage: 'execution' }, note: 'See [executions](' + listUrls.execution + ')' },
  platform: { type: Types.Relationship, ref: 'Platform', dependsOn: { usage: 'execution' }, note: 'See [platforms](' + listUrls.platform + ')' },
  people: { type: Types.Relationship, ref: 'Person', many: true, collapse: true, note: 'See [people](' + listUrls.person + ')' },
  tags: { type: Types.Relationship, ref: 'ImageTag', many: true, collapse: true },
  related: { type: Types.Relationship, ref: 'Image', many: true, collapse: true }
});

meta.add({ list: _Image });

// Virtuals
// ------------------------------


// Pre Save
// ------------------------------

_Image.schema.pre('save', function (next) {
  this.wasNew = this.isNew;
  next();
});

_Image.schema.pre('save', function(next) {
  var image = this;
  // If no published date, it's a new draft
  if (image.wasNew){
    image.status = 'draft';
  } 
  next();
});

// TODO: refactor to abstracted module
_Image.schema.pre('save', function(next) {
  var image = this
    , Execution = keystone.list('Execution').model
    , q;

  // if image is an execution and the execution has been set...
  if (image.usage === 'execution' && image.execution){
    q = Execution.findOne({ _id: image.execution });
    q.exec().then(function (execution){
      // if the image isn't assigned to the execution.videos, add it
      var imageIds = _.map(execution.images, function (imageId){
        return imageId.toString();
      });

      if (!_.contains(imageIds, image._id.toString())){
        execution.images.push(image._id);
        execution.save(function (err){
          if (err){
            return next(err);
          } 
          next();
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
  list: _Image, 
  related: [ 'Execution', 'CollectionItem' ],
  path: 'images'
});


// Methods
// ------------------------------

methods.toJSON.set({ 
  list: _Image
});

_Image.defaultColumns = 'title, usage, status';
_Image.register();


