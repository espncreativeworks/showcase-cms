// Simulate config options from your production environment by
// customising the .env file in your project's root folder.
require('dotenv').load();

if ('production' === process.env.NODE_ENV){
	require('newrelic');
}

// Require keystone
var keystone = require('keystone')
	, handlebars = require('express-handlebars')
	, raygun = require('raygun')
	, raygunClient = new raygun.Client().init({ apiKey: process.env.RAYGUN_APIKEY })
	, appName = 'Showcase'
	, cmsUrl = 'http://localhost:3000/keystone/';

if ('production' !== process.env.NODE_ENV){
	appName += ' (' + process.env.NODE_ENV + ')';
}

if ('production' === process.env.NODE_ENV){
	cmsUrl = 'http://cms.espncreativeworks.com/keystone/';
}

if ('staging' === process.env.NODE_ENV){
	cmsUrl = 'http://showcase-cms-stg.herokuapp.com/keystone/';
}

if ('development' === process.env.NODE_ENV){
	cmsUrl = 'http://localhost:3000/keystone/';
}



// Initialise Keystone with your project's configuration.
// See http://keystonejs.com/guide/config for available options
// and documentation.

keystone.init({

	// 'name': appName,
	// 'brand': appName,

	'name': 'ESPN CreativeWorks Showcase',
	'brand': 'Showcase CMS',
	
	'sass': 'public',
	'static': 'public',
	'favicon': 'public/favicon.ico',
	'views': 'templates/views',
	'view engine': 'hbs',
	
	'custom engine': handlebars.create({
		layoutsDir: 'templates/views/layouts',
		partialsDir: 'templates/views/partials',
		defaultLayout: 'default',
		helpers: new require('./templates/views/helpers')(),
		extname: '.hbs'
	}).engine,
	
	'emails': 'templates/emails',
	
	'auto update': true,
	'session': true,
	'session store': 'mongo',
	'auth': true,
	'user model': 'User',
	'cookie secret': process.env.COOKIE_SECRET,
	'raygun client': raygunClient,
	'list urls': {
		project: cmsUrl + 'projects',
		execution: cmsUrl + 'executions',
		image: cmsUrl + 'images',
		video: cmsUrl + 'videos',
		executionTag: cmsUrl + 'execution-tags',
		platform: cmsUrl + 'platforms',
		sport: cmsUrl + 'sports',
		industry: cmsUrl + 'industries',
		brand: cmsUrl + 'brands',
		person: cmsUrl + 'people'
	}

});

// Load your project's Models

keystone.import('models');

// Setup common locals for your templates. The following are required for the
// bundled templates and layouts. Any runtime locals (that should be set uniquely
// for each request) should be added to ./routes/middleware.js

keystone.set('locals', {
	_: require('underscore'),
	env: keystone.get('env'),
	utils: keystone.utils,
	editable: keystone.content.editable
});

// Load your project's Routes

keystone.set('routes', require('./routes'));

// Setup common locals for your emails. The following are required by Keystone's
// default email templates, you may remove them if you're using your own.

/* jshint ignore:start */
keystone.set('email locals', {
	logo_src: '/images/logo-email.gif', 
	logo_width: 194, 
	logo_height: 76, 
	theme: {
		email_bg: '#f9f9f9',
		link_color: '#2697de',
		buttons: {
			color: '#fff',
			background_color: '#2697de',
			border_color: '#1a7cb7'
		}
	}
});
/* jshint ignore:end */

// Setup replacement rules for emails, to automate the handling of differences
// between development a production.

// Be sure to update this rule to include your site's actual domain, and add
// other rules your email templates require.

keystone.set('email rules', [{
	find: '/images/',
	replace: (keystone.get('env') === 'production') ? 'http://cms.espncreativeworks/images/' : 'http://localhost:3000/images/'
}, {
	find: '/keystone/',
	replace: cmsUrl
}]);

// Load your project's email test routes

keystone.set('email tests', require('./routes/emails'));

// Configure the navigation bar in Keystone's Admin UI

keystone.set('nav', {
	'projects': 'projects',
	'executions': 'executions',
	'media': ['videos', 'images', 'documents'],
	'tags': ['execution-tags', 'image-tags', 'video-tags', 'document-tags'],
	'segments': ['platforms', 'sports', 'industries', 'channels'],
	// 'blog': ['posts', 'post-tags'],
	// 'contact': 'enquiries',
	'profiles': ['brands', 'people', 'locations', 'accounts'],
	'collections': ['collections', 'collection-items'],
	'admin': ['users']
});

// Start Keystone to connect to your database and initialise the web server

keystone.start();
