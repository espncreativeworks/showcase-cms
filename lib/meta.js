var keystone = require('keystone')
  , utils = keystone.utils
  , Types = keystone.Field.Types
  , BitlyAPI = require('node-bitlyapi')
  , Bitly = new BitlyAPI({ 
    client_id: process.env.BITLY_CLIENT_ID, 
    client_secret: process.env.BITLY_CLIENT_SECRET 
  });

Bitly.setAccessToken(process.env.BITLY_ACCESS_TOKEN);

function shorten (callback) {
  var self = this;
  if (!self.meta.uris.web){ return callback(new Error('Invalid self.meta.uris.web'), null); }
  Bitly.shortenLink('http://showcase.espncreativeworks.com' + self.meta.uris.web, function (err, response){
    if (typeof response !== 'object') { response = JSON.parse(response); }
    console.log(response);
    if (err) { callback(err, null); return; }
    if (!response.data.url){ callback(new Error('Invalid Bitly response'), null); return; }
    callback(null, response.data.url);  
    return;
  });
}

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
    , resource = utils.slug(opts.resource || List.plural.toLowerCase(), '-')

  List.add(title, {
    meta: {
      title: { type: Types.Text, label: 'Title', collapse: true },
      description: { type: Types.Textarea, label: 'Description', collapse: true },
      keywords: { type: Types.Text, label: 'Keywords', collapse: true },
      slug: { type: Types.Key, label: 'Slug', collapse: true, note: 'Overrides default slug' },
      facebook: {
        title: { type: Types.Text, label: 'Facebook Title', collapse: true },
        description: { type: Types.Textarea, label: 'Facebook Desc', collapse: true },
        image: { type: Types.Relationship, ref: 'Image', filters: { usage: 'facebook' }, label: 'Facebook Image', collapse: true }
      },
      twitter: {
        title: { type: Types.Text, label: 'Twitter Title', collapse: true },
        description: { type: Types.Textarea, label: 'Twitter Desc', collapse: true },
        image: { type: Types.Relationship, ref: 'Image', filters: { usage: 'twitter' }, label: 'Twitter Image', collapse: true }
      },
      uris: {
        api: { type: Types.Text, label: 'API URI', hidden: true, watch: true, value: function (){ return '/api/' + resource + '/' + this._id; } }, 
        web: { type: Types.Text, label: 'Web URI', hidden: true, watch: true, value: function (){ return '/' + resource + '/' + this._id; } },
        ios: { type: Types.Text, label: 'iOS URI', hidden: true, watch: true, value: function (){ return '/' + resource + '/' + this._id; } },
        android: { type: Types.Text, label: 'Android URI', hidden: true, watch: true, value: function (){ return '/' + resource + '/' + this._id; } },
        shortened: { type: Types.Url, label: 'Short URL', hidden: true, watch: true, value: shorten }
      },
      publishedAt: { type: Types.Datetime, label: 'Last Published', noedit: true, watch: true, value: function (){ if (this.status && this.status === 'published'){ return new Date(); } else { return this.publishedAt; } } } 
    }
  });

  return List;
}

exports = module.exports = {
  add: _add
};