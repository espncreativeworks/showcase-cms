var keystone = require('keystone')
	, Types = keystone.Field.Types
	, path = require('path');
	// , util = require('util');

/**
 * Enquiry Model
 * =============
 */

var Enquiry = new keystone.List('Enquiry', {
	nocreate: true,
	noedit: true
});

Enquiry.add({
	name: { type: Types.Name, required: true },
	email: { type: Types.Email, required: true },
	phone: { type: String },
	enquiryType: { type: Types.Select, options: [
		{ value: 'message', label: 'Just leaving a message' },
		{ value: 'question', label: 'I\'ve got a question' },
		{ value: 'other', label: 'Something else...' }
	] },
	message: { type: Types.Markdown, required: true },
	createdAt: { type: Date, default: Date.now }
});

Enquiry.schema.pre('save', function(next) {
	this.wasNew = this.isNew;
	next();
});

Enquiry.schema.post('save', function() {
	if (this.wasNew) {
		this.sendNotificationEmail();
	}
});

Enquiry.schema.methods.sendNotificationEmail = function(callback) {
	
	if ('function' !== typeof callback) {
		callback = function() {};
	}

	var enquiry = this;

	// var handlebars = require('express-handlebars');

	// var engine = handlebars.create({
	// 	layoutsDir: 'templates/emails/layouts',
	// 	partialsDir: 'templates/emails/partials',
	// 	defaultLayout: 'default',
	// 	helpers: new require('../templates/emails/helpers')(),
	// 	extname: '.hbs'
	// }).engine;

	// var defaultConfig = {
	// 	templateExt: 'jade',
	// 	templateEngine: require('jade'),
	// 	templateBasePath: path.normalize(path.join(__dirname, '..', 'templates', 'emails')),
	// 	mandrill: {
	// 		track_opens: true,
	// 		track_clicks: true,
	// 		preserve_recipients: false,
	// 		inline_css: true
	// 	},
	// 	// Mandrill template
	// 	templateMandrillName: null,
	// 	templateForceHtml: false // Force html render
	// };

	var options = {
		templateExt: 'hbs',
		templateEngine: require('handlebars'),
		templateBasePath: path.normalize(path.join(__dirname, '..', 'templates', 'emails')),
		templateName: 'enquiry-notification'
	};
	
	keystone.list('User').model.find().where('isAdmin', true).exec(function(err, admins) {
		
		if (err) return callback(err);

		var email = new keystone.Email(options);

		//console.log(util.inspect(email));

		email.send({
			to: admins,
			from: {
				name: 'ESPN CreativeWorks',
				email: 'espncw@gmail.com'
			},
			subject: 'New Enquiry for ESPN CreativeWorks Showcase',
			enquiry: enquiry
		}, callback);
		
		// new keystone.Email('enquiry-notification').send({
		// 	to: admins,
		// 	from: {
		// 		name: 'ESPN CreativeWorks Showcase',
		// 		email: 'contact@espn-creativeworks-showcase.com'
		// 	},
		// 	subject: 'New Enquiry for ESPN CreativeWorks Showcase',
		// 	enquiry: enquiry
		// }, callback);
		
	});
	
};

Enquiry.defaultSort = '-createdAt';
Enquiry.defaultColumns = 'name, email, enquiryType, createdAt';
Enquiry.register();
