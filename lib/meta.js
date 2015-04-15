var keystone = require('keystone')
  , Types = keystone.Field.Types;

/**
 * Adds a 'meta' field to the List
 * Based on Mongoose's Schema.add
 *
 * @param {Object} opts
 * @api public
 */

function _add (opts){
  var List = opts.list
    , title = opts.title || 'Meta'
    , resource = opts.resource || List.plural.toLowerCase()

  List.add(title, {
    meta: {
      title: { type: Types.Text, label: 'Title' },
      description: { type: Types.Textarea, label: 'Description' },
      keywords: { type: Types.Text, label: 'Keywords' },
      facebook: {
        title: { type: Types.Text, label: 'Facebook Title' },
        description: { type: Types.Textarea, label: 'Facebook Desc' },
        image: { type: Types.Relationship, ref: 'Image', filters: { usage: 'facebook' }, label: 'Facebook Image' }
      },
      twitter: {
        title: { type: Types.Text, label: 'Twitter Title' },
        description: { type: Types.Textarea, label: 'Twitter Desc' },
        image: { type: Types.Relationship, ref: 'Image', filters: { usage: 'twitter' }, label: 'Twitter Image' }
      },
      uris: {
        api: { type: Types.Text, label: 'API URI', hidden: true, watch: true, value: function (){ return '/api/' + resource + '/' + this._id; } }, 
        web: { type: Types.Text, label: 'Web URI', hidden: true, watch: true, value: function (){ return '/' + resource + '/' + this._id; } },
        ios: { type: Types.Text, label: 'iOS URI', hidden: true, watch: true, value: function (){ return '/' + resource + '/' + this._id; } },
        android: { type: Types.Text, label: 'Android URI', hidden: true, watch: true, value: function (){ return '/' + resource + '/' + this._id; } }
      },
      publishedAt: { type: Types.Datetime, label: 'Last Published', noedit: true, watch: true, value: function (){ if (this.status && this.status === 'published'){ return new Date(); } else { return this.publishedAt; } } } 
    }
  });

  return List;
}

exports = module.exports = {
  add: _add
};