var moment = require('moment');
var _ = require('underscore');
var hbs = require('handlebars');
var keystone = require('keystone');
var cloudinary = require('cloudinary');


// Declare Constants
var CLOUDINARY_HOST = 'http://res.cloudinary.com';

// Collection of templates to interpolate
var linkTemplate = _.template('<a href="<%= url %>"><%= text %></a>');
var scriptTemplate = _.template('<script src="<%= src %>"></script>');
var cssLinkTemplate = _.template('<link href="<%= href %>" rel="stylesheet">');
var cloudinaryUrlLimit = _.template(CLOUDINARY_HOST + '/<%= cloudinaryUser %>/image/upload/c_limit,f_auto,h_<%= height %>,w_<%= width %>/<%= publicId %>.jpg');


module.exports = function() {
  
  var _helpers = {};
  
  /**
   * Generic HBS Helpers
   * ===================
   */
  
  // standard hbs equality check, pass in two values from template
  // {{#ifeq keyToCheck data.myKey}} [requires an else blockin template regardless]
  _helpers.ifeq = function(a, b, options) {
    if (a == b) {
      return options.fn(this);
    } else {
      return options.inverse(this);
    }
  };
  
  /**
   * Port of Ghost helpers to support cross-theming
   * ==============================================
   * 
   * Also used in the default keystonejs-hbs theme
   */
  
  // ### Date Helper
  // A port of the Ghost Date formatter similar to the keystonejs - jade interface
  //
  //
  // *Usage example:*
  // `{{date format='MM YYYY}}`
  // `{{date publishedDate format='MM YYYY'`
  //
  // Returns a string formatted date
  // By default if no date passed into helper than then a current-timestamp is used
  //
  // Options is the formatting and context check this.publishedDate
  // If it exists then it is formated, otherwise current timestamp returned
  
  _helpers.date = function(context, options) {
    if (!options && context.hasOwnProperty('hash')) {
      options = context;
      context = undefined;
      
      if (this.publishedDate) {
        context = this.publishedDate;
      }
    }
    
    // ensure that context is undefined, not null, as that can cause errors
    context = context === null ? undefined : context;
    
    var f = options.hash.format || 'MMM Do, YYYY',
      timeago = options.hash.timeago,
      date;
    
    // if context is undefined and given to moment then current timestamp is given
    // nice if you just want the current year to define in a tmpl
    if (timeago) {
      date = moment(context).fromNow();
    } else {
      date = moment(context).format(f);
    }
    return date;
  };
  
  // ### Category Helper
  // Ghost uses Tags and Keystone uses Categories
  // Supports same interface, just different name/semantics
  //
  // *Usage example:*
  // `{{categoryList categories separator=' - ' prefix='Filed under '}}`
  //
  // Returns an html-string of the categories on the post.
  // By default, categories are separated by commas.
  // input. categories:['tech', 'js']
  // output. 'Filed Undder <a href="blog/tech">tech</a>, <a href="blog/js">js</a>'
  
  _helpers.categoryList = function(categories, options) {
    var autolink = _.isString(options.hash.autolink) && options.hash.autolink === "false" ? false : true,
      separator = _.isString(options.hash.separator) ? options.hash.separator : ', ',
      prefix = _.isString(options.hash.prefix) ? options.hash.prefix : '',
      suffix = _.isString(options.hash.suffix) ? options.hash.suffix : '',
      output = '';
    
    function createTagList(tags) {
      var tagNames = _.pluck(tags, 'name');
      
      if (autolink) {
        return _.map(tags, function(tag) {
          return linkTemplate({
            url: ('/blog/' + tag.key),
            text: _.escape(tag.name)
          });
        }).join(separator);
      }
      return _.escape(tagNames.join(separator));
    }
    
    if (categories && categories.length) {
      output = prefix + createTagList(categories) + suffix;
    }
    return new hbs.SafeString(output);
  };
  
  /* To Implement [Ghost Helpers](http://docs.ghost.org/themes/#helpers)
   * The [source](https://github.com/TryGhost/Ghost/blob/master/core/server/helpers/index.js)
   *
   * * `Foreach` Extended Helper
   * * `Asset` Helper
   * * `Content` Helper
   * * `Excerpt` Helper
   * * `Has` Helper
   * * `Encode` Helper
   * * Pagination
   * * BodyClass
   * * PostClass
   * * meta_title
   * * meta_description
   * * ghost_[footer/header]
   *
   */
  
  // ### CloudinaryUrl Helper
  // Direct support of the cloudinary.url method from Handlebars (see
  // cloudinary package documentation for more details).
  //
  // *Usage examples:*
  // `{{{cloudinaryUrl image width=640 height=480 crop='fill' gravity='north'}}}`
  // `{{#each images}} {{cloudinaryUrl width=640 height=480}} {{/each}}`
  //
  // Returns an src-string for a cloudinary image
  
  _helpers.cloudinaryUrl = function(context, options) {

    // if we dont pass in a context and just kwargs
    // then `this` refers to our default scope block and kwargs
    // are stored in context.hash
    if (!options && context.hasOwnProperty('hash')) {
      // strategy is to place context kwargs into options
      options = context;
      // bind our default inherited scope into context
      context = this;
    }
    
    // safe guard to ensure context is never null
    context = context === null ? undefined : context;
    
    if ((context) && (context.public_id)) {
      var imageName = context.public_id.concat('.',context.format);
      return cloudinary.url(imageName, options.hash);
    }
    else {
      return null;
    }   
  };
  
  // ### Content Url Helpers
  // KeystoneJS url handling so that the routes are in one place for easier
  // editing.  Should look at Django/Ghost which has an object layer to access
  // the routes by keynames to reduce the maintenance of changing urls
  
  // Direct url link to a specific post
  _helpers.postUrl = function(postSlug, options) {
    return ('/blog/post/' + postSlug);
  };
  
  // might be a ghost helper
  // used for pagination urls on blog
  _helpers.pageUrl = function(pageNumber, options) {
    return '/blog?page=' + pageNumber;
  };
  
  // create the category url for a blog-category page
  _helpers.categoryUrl = function(categorySlug, options) {
    return ('/blog/' + categorySlug);
  };
  
  return _helpers;
};
