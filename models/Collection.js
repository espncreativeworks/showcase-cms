var keystone = require('keystone')
  , Types = keystone.Field.Types
  , meta = require('../lib/meta')
  , removeFromRelated = require('../lib/hooks/removeFromRelated')
  , removeRelatedChild = require('../lib/hooks/removeRelatedChild')
  , statics = require('../lib/statics')
  , methods = require('../lib/methods')
  , _ = require('underscore');

/**
 * Collection Model
 * ==========
 */

var Collection = new keystone.List('Collection', {
  map: { name: 'title' },
  autokey: { path: 'slug', from: 'title', unique: true },
  track: true,
  searchFields: 'title, creator.name, creator.email'
});

Collection.add({
  title: { type: Types.Text },
  creator: { type: Types.Relationship, ref: 'Account' }, 
  items: { type: Types.Relationship, ref: 'CollectionItem', many: true, filters: { belongsTo: ':_id' } },
  status: { type: Types.Select, options: 'draft, published, archived', default: 'published', index: true },
  visibility: { type: Types.Select, options: 'public, private', default: 'public', index: true },
  isPopular: { type: Types.Boolean, default: false },
  isStaffPick: { type: Types.Boolean, default: false }
});

meta.add({ list: Collection });

// Virtuals
// ------------------------------

// Pre Save
// ------------------------------

// TODO: refactor to abstracted module
Collection.schema.pre('save', function(next) {
  var collection = this
    , Account = keystone.list('Account').model
    , q;

  // if collection has a creator, add to it's collections...
  if (collection.creator){
    q = Account.findOne({ _id: collection.creator });
    q.exec().then(function (account){
      // if the collection isn't assigned to the account.collections, add it
      var collectionIds = _.map(account.collections, function (collectionId){
        return collectionId.toString();
      });

      if (!_.contains(collectionIds, collection._id.toString())){
        account.collections.push(collection._id);
        account.save(function (err){
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
  list: Collection, 
  related: [ 'Account' ],
  path: 'collections'
});

removeRelatedChild.add({ 
  list: Collection, 
  related: [ 'CollectionItem' ],
  path: 'belongsTo'
});

// Statics
// ------------------------------

statics.findOrCreate.add({ 
  list: Collection, 
  validKeys: [ 'title', 'description', 'creator', 'items', 'status', 'visibility' ] 
});

// Methods
// ------------------------------

methods.toJSON.set({ 
  list: Collection
});

Collection.defaultSort = '-createdAt';
Collection.defaultColumns = 'title, creator, status, visibility, modifiedAt';
Collection.register();


