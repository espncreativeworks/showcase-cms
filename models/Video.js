var keystone = require('keystone')
  , Types = keystone.Field.Types
  , meta = require('../lib/meta')
  , methods = require('../lib/methods')
  , removeFromRelated = require('../lib/hooks/removeFromRelated')
  , _ = require('underscore');


/**
 * Video Model
 * ==========
 */

var Video = new keystone.List('Video', {
  map: { name: 'title' },
  autokey: { path: 'slug', from: 'title', unique: true },
  track: true,
  searchFields: 'name, meta.keywords',
  sortable: true
});

Video.add({
  title: { type: String, required: true, initial: true },
  host: { 
    type: Types.Select, 
    options: [
      { value: 'vimeo', label: 'Vimeo' },
      { value: 'youtube', label: 'YouTube' },
      { value: 'espn', label: 'ESPN' }
    ], 
    default: 'vimeo', 
    required: true,
    initial: true,
    index: true 
  },
  usage: { type: Types.Select, options: 'animation, execution, hero, poster, other', default: 'execution', required: true, initial: true, index: true },
  execution: { type: Types.Relationship, ref: 'Execution', dependsOn: { usage: 'execution' } },
  platform: { type: Types.Relationship, ref: 'Platform', dependsOn: { usage: 'execution' } },
  status: { type: Types.Select, options: 'draft, published, archived', default: 'draft', index: true },
  people: { type: Types.Relationship, ref: 'Person', many: true, collapse: true },
  tags: { type: Types.Relationship, ref: 'VideoTag', many: true, collapse: true },
  related: { type: Types.Relationship, ref: 'Video', many: true, collapse: true }
}, 
{ heading: 'YouTube', dependsOn: { host: 'youtube' } }, 
{
  youtube: {
    id: { type: Types.Text, index: true, label: 'YouTube ID', dependsOn: { host: 'youtube' } },
    url: { type: Types.Url, watch: 'youtube.id', value: function (){ return 'http://youtu.be/' + this.youtube.id; }, label: 'YouTube URL', noedit: true, dependsOn: { host: 'youtube' } },
    embed: { type: Types.Embedly, from: 'youtube.url', dependsOn: { host: 'youtube' } }
  }
}, 
{ heading: 'Vimeo', dependsOn: { host: 'vimeo' } }, 
{
  vimeo: {
    id: { type: Types.Text, index: true, label: 'Vimeo ID', dependsOn: { host: 'vimeo' } },
    url: { type: Types.Url, watch: 'vimeo.id', value: function (){ return 'https://vimeo.com/' + this.vimeo.id; }, label: 'Vimeo URL', noedit: true, dependsOn: { host: 'vimeo' } },
    embed: { type: Types.Embedly, from: 'vimeo.url', hidden: true, dependsOn: { host: 'vimeo' } }
  }
},
{ heading: 'ESPN', dependsOn: { host: 'espn' } }, 
{
  espn: {
    id: { type: Types.Text, index: true, label: 'ESPN ID', dependsOn: { host: 'espn' } },
    url: { type: Types.Url, watch: 'espn.id', value: function (){ return 'http://espn.go.com/video/clip?id=' + this.espn.id; }, label: 'ESPN URL', noedit: true, dependsOn: { host: 'espn' } },
    embed: { type: Types.Embedly, from: 'espn.url', dependsOn: { host: 'espn' } }
  }
}, 'Overrides', {
  description: {
    brief: { type: Types.Markdown, collapse: true },
    extended: { type: Types.Markdown, collapse: true }
  },
  caption: { type: Types.Markdown, collapse: true },
  credit: { type: Types.Markdown, collapse: true }
}, 'More', {
  url: { type: Types.Url, watch: 'youtube.id vimeo.id espn.id', value: function (){ return this[this.host].url; }, label: 'Active Video URL', noedit: true },
  embed: { type: Types.Embedly, from: 'url' }
});

meta.add({ list: Video });


// Virtuals
// ------------------------------

Video.schema.virtual('description.full').get(function() {
  return this.description.extended || this.description.brief;
});


// Methods
// ------------------------------

// Video.schema.set('toJSON', {
//   transform: function(doc) {
//     var keys = ['__v'];

//     if (!_.has(doc, 'youtube') || doc.youtube.id === ''){
//       keys.push('youtube');
//     }

//     if (!_.has(doc, 'vimeo') || doc.vimeo.id === ''){
//       keys.push('vimeo');
//     }

//     if (!_.has(doc, 'espn') || doc.espn.id === ''){
//       keys.push('espn');
//     }

//     return _.omit(doc, keys);
//   }
// });

methods.toJSON.set({ 
  list: Video
});


// Pre Save
// ------------------------------

// TODO: refactor to abstracted module
Video.schema.pre('save', function(next) {
  var video = this
    , Execution = keystone.list('Execution').model
    , q;

  // if video is an execution and the execution has been set...
  if (video.usage === 'execution' && video.execution){
    q = Execution.findOne({ _id: video.execution });
    q.exec().then(function (execution){
      // if the video isn't assigned to the execution.videos, add it
      var videoIds = _.map(execution.videos, function (videoId){
        return videoId.toString();
      });

      if (!_.contains(videoIds, video._id.toString())){
        execution.videos.push(video._id);
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
  list: Video, 
  related: [ 'Execution', 'CollectionItem' ],
  path: 'videos'
});


// Registration
// ------------------------------

Video.defaultColumns = 'title, status, meta.publishedAt';
Video.register();


