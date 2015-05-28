var keystone = require('keystone')
  , Types = keystone.Field.Types
  , meta = require('../lib/meta')
  , removeFromRelated = require('../lib/hooks/removeFromRelated')
  , statics = require('../lib/statics')
  , methods = require('../lib/methods')
  , _ = require('underscore');

/**
 * CollectionItem Model
 * ==========
 */

var CollectionItem = new keystone.List('CollectionItem', {
  track: true,
  searchFields: 'belongsTo, title, notes, image, video, document'
});

CollectionItem.add({
  title: { type: Types.Text, collapse: true },
  notes: { type: Types.Textarea, collapse: true },
  belongsTo: { type: Types.Relationship, ref: 'Collection', label: 'Collection', required: true, initial: true }, 
}, 'Content', {
  image: { type: Types.Relationship, ref: 'Image', collapse: true },
  video: { type: Types.Relationship, ref: 'Video', collapse: true },
  document: { type: Types.Relationship, ref: 'Document', collapse: true }
});

meta.add({ list: CollectionItem });

// Virtuals
// ------------------------------

// Pre Save
// ------------------------------

// TODO: refactor to abstracted module
CollectionItem.schema.pre('save', function(next) {
  var collectionItem = this
    , Collection = keystone.list('Collection').model
    , q;

  // if collectionItem has a belongsTo, add to it's collectionItems...
  if (collectionItem.belongsTo){
    q = Collection.findOne({ _id: collectionItem.belongsTo });
    q.exec().then(function (collection){
      // if the collectionItem isn't assigned to the collection.collectionItems, add it
      var collectionItemIds = _.map(collection.items, function (collectionItemId){
        return collectionItemId.toString();
      });

      if (!_.contains(collectionItemIds, collectionItem._id.toString())){
        collection.items.push(collectionItem._id);
        collection.save(function (err){
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
  list: CollectionItem, 
  related: [ 'Collection' ],
  path: 'items'
});

// Statics
// ------------------------------

statics.findOrCreate.add({ 
  list: CollectionItem, 
  validKeys: [ 'belongsTo', 'title', 'notes', 'video', 'image', 'document' ] 
});


// Methods
// ------------------------------

methods.toJSON.set({ 
  list: CollectionItem
});

CollectionItem.defaultSort = '-createdAt';
CollectionItem.defaultColumns = '_id, belongsTo, modifiedAt';
CollectionItem.register();


