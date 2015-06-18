/**
 * Shortens meta.uris.web; saves to meta.uris.shortened. 
 * Used for sharing.
 * 
 */

var keystone = require('keystone')
	, async = require('async')
	, BitlyAPI = require('node-bitlyapi')
  , Bitly = new BitlyAPI({ 
    client_id: process.env.BITLY_CLIENT_ID, 
    client_secret: process.env.BITLY_CLIENT_SECRET 
  })
	, models = [
		keystone.list('Project').model,
		keystone.list('Execution').model,
		keystone.list('Image').model,
		keystone.list('Video').model,
		keystone.list('Document').model,
		keystone.list('Brand').model,
		keystone.list('Collection').model,
		keystone.list('Industry').model,
		keystone.list('Location').model,
		keystone.list('Person').model,
		keystone.list('Platform').model,
		keystone.list('Sport').model
	] 
	, saver = function (document){
		return function (callback){
			if (!document.meta.uris.web){ callback(new Error('Invalid document.meta.uris.web'), null); return; }
		  Bitly.shortenLink('http://showcase.espncreativeworks.com' + document.meta.uris.web, function (err, response){
		  	if (err) { callback(err, null); return; }
		    if (typeof response !== 'object') { response = JSON.parse(response); }
		    if (!response.data.url){ callback(new Error('Invalid Bitly response'), null); return; }
		    document.meta.uris.shortened = response.data.url;
		    document.save(callback);
		    return;
		  });
		};
	} 
	, tasks = [];

Bitly.setAccessToken(process.env.BITLY_ACCESS_TOKEN);

models.forEach(function (Model){
	Model.find({}).exec().then(function (documents){
		documents.forEach(function (document){
			tasks.push(saver(document));
		});
	});
});

var update = function (done) {
	async.parallelLimit(tasks, 7, done);
};

if (process.env.NODE_ENV !== 'production') {
	update = function (done) {
		setTimeout(function (){
			done(null, []);
		}, 50);
	}
}

exports = module.exports = update;