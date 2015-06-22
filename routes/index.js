/**
 * This file is where you define your application routes and controllers.
 * 
 * Start by including the middleware you want to run for every request;
 * you can attach middleware to the pre('routes') and pre('render') events.
 * 
 * For simplicity, the default setup for route controllers is for each to be
 * in its own file, and we import all the files in the /routes/views directory.
 * 
 * Each of these files is a route controller, and is responsible for all the
 * processing that needs to happen for the route (e.g. loading data, handling
 * form submissions, rendering the view template, etc).
 * 
 * Bind each route pattern your application should respond to in the function
 * that is exported from this module, following the examples below.
 * 
 * See the Express application routing documentation for more information:
 * http://expressjs.com/api.html#app.VERB
 */

var keystone = require('keystone')
  , middleware = require('./middleware')
  , importRoutes = keystone.importer(__dirname);

// Common Middleware
keystone.pre('routes', middleware.initLocals);
keystone.pre('render', middleware.flashMessages);

// Import Route Controllers
var routes = {
  views: importRoutes('./views'),
  api: importRoutes('./api')
};

// Setup Route Bindings
exports = module.exports = function(app) {
  
  // Views
  app.get('/', routes.views.index);
  app.get('/blog/:tag?', routes.views.blog);
  app.get('/blog/post/:post', routes.views.post);
  app.all('/contact', routes.views.contact);
  
  // NOTE: To protect a route so that only admins can see it, use the requireUser middleware:
  // app.get('/protected', middleware.requireUser, routes.views.protected);

  // API

  // account-scoped resources
  app.get('/api/accounts/me/collections', routes.api.collections.me.list);
  app.get('/api/accounts/me/collections/:key', routes.api.collections.me.show);
  app.get('/api/accounts/:accountId/collections', routes.api.collections.account.list);
  app.get('/api/accounts/:accountId/collections/:key', routes.api.collections.account.show);
  
  // brands
  app.get('/api/brands', routes.api.brands.list);
  // app.post('/api/brands', routes.api.brands.create);
  app.get('/api/brands/:key', routes.api.brands.show);

  // channels
  app.get('/api/channels', routes.api.channels.list);
  // app.post('/api/channels', routes.api.channels.create);
  app.get('/api/channels/:key', routes.api.channels.show);

  // collection-items
  app.get('/api/collection-items', routes.api.collectionItems.list);
  app.post('/api/collection-items', routes.api.collectionItems.create);
  app.get('/api/collection-items/:key', routes.api.collectionItems.show);
  app.put('/api/collection-items/:key', routes.api.collectionItems.update);
  app.patch('/api/collection-items/:key', routes.api.collectionItems.update);
  app.delete('/api/collection-items/:key', routes.api.collectionItems.destroy);

  // collections
  app.get('/api/collections', routes.api.collections.list);
  app.post('/api/collections', routes.api.collections.create);
  app.get('/api/collections/:key', routes.api.collections.show);
  app.put('/api/collections/:key', routes.api.collections.update);
  app.patch('/api/collections/:key', routes.api.collections.update);
  app.delete('/api/collections/:key', routes.api.collections.destroy);

  // documents
  app.get('/api/documents', routes.api.documents.list);
  // app.post('/api/documents', routes.api.documents.create);
  app.get('/api/documents/:key', routes.api.documents.show);

  // documentTags
  app.get('/api/document-tags', routes.api.documentTags.list);
  // app.post('/api/document-tags', routes.api.documentTags.create);
  app.get('/api/document-tags/:key', routes.api.documentTags.show);

  // executions
  app.get('/api/executions', routes.api.executions.list);
  // app.post('/api/executions', routes.api.executions.create);
  app.get('/api/executions/:key', routes.api.executions.show);

  // executionTags
  app.get('/api/execution-tags', routes.api.executionTags.list);
  // app.post('/api/execution-tags', routes.api.executionTags.create);
  app.get('/api/execution-tags/:key', routes.api.executionTags.show);

  // images
  app.get('/api/images', routes.api.images.list);
  // app.post('/api/images', routes.api.images.create);
  app.get('/api/images/:key', routes.api.images.show);
  
  // imageTags
  app.get('/api/image-tags', routes.api.imageTags.list);
  // app.post('/api/image-tags', routes.api.imageTags.create);
  app.get('/api/image-tags/:key', routes.api.imageTags.show);

  // industries
  app.get('/api/industries', routes.api.industries.list);
  // app.post('/api/industries', routes.api.industries.create);
  app.get('/api/industries/:key', routes.api.industries.show);

  // locations
  app.get('/api/locations', routes.api.locations.list);
  // app.post('/api/locations', routes.api.locations.create);
  app.get('/api/locations/:key', routes.api.locations.show);

  // peoples
  app.get('/api/people', routes.api.people.list);
  // app.post('/api/people', routes.api.people.create);
  app.get('/api/people/:key', routes.api.people.show);

  // platforms
  app.get('/api/platforms', routes.api.platforms.list);
  // app.post('/api/platforms', routes.api.platforms.create);
  app.get('/api/platforms/:key/executions', routes.api.platforms.executions);
  app.get('/api/platforms/:key', routes.api.platforms.show);


  // postTags
  app.get('/api/post-tags', routes.api.postTags.list);
  // app.post('/api/post-tags', routes.api.postTags.create);
  app.get('/api/post-tags/:key', routes.api.postTags.show);

  // posts
  app.get('/api/posts', routes.api.posts.list);
  // app.post('/api/posts', routes.api.posts.create);
  app.get('/api/posts/:key', routes.api.posts.show);

  // projects
  app.get('/api/projects', routes.api.projects.list);
  app.head('/api/projects/featured', routes.api.projects.monitor);
  app.get('/api/projects/featured', routes.api.projects.featured);
  app.get('/api/projects/search', routes.api.projects.search);
  // app.post('/api/projects', routes.api.projects.create);
  app.get('/api/projects/:key', routes.api.projects.show);
  app.get('/api/projects/:key/tags', routes.api.projects.tags);
  app.get('/api/projects/:key/executions', routes.api.projects.executions);

  // sports
  app.get('/api/sports', routes.api.sports.list);
  // app.post('/api/sports', routes.api.sports.create);
  app.get('/api/sports/:key', routes.api.sports.show);

  // timezones
  app.get('/api/timezones', routes.api.timezones.list);
  // app.post('/api/timezones', routes.api.timezones.create);
  app.get('/api/timezones/:key', routes.api.timezones.show);

  // users
  app.get('/api/users', routes.api.users.list);
  // app.post('/api/users', routes.api.users.create);
  app.get('/api/users/:key', routes.api.users.show);

  // videos
  app.get('/api/videos', routes.api.videos.list);
  // app.post('/api/videos', routes.api.videos.create);
  app.get('/api/videos/:key', routes.api.videos.show);

  // videoTags
  app.get('/api/video-tags', routes.api.videoTags.list);
  // app.post('/api/video-tags', routes.api.videoTags.create);
  app.get('/api/video-tags/:key', routes.api.videoTags.show);


  // error handler must be last middleware
  app.use(middleware.raygunErrorHandler);
};
