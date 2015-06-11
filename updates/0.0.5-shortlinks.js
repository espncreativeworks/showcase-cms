/**
 * Shortens meta.uris.web; saves to meta.uris.shortened. 
 * Used for sharing.
 * 
 */

var keystone = require('keystone')
	, EventEmmiter = require('events').EventEmmiter
	, async = require('async')
	, BitlyAPI = require('node-bitlyapi')
  , Bitly = new BitlyAPI({ 
    client_id: process.env.BITLY_CLIENT_ID, 
    client_secret: process.env.BITLY_CLIENT_SECRET 
  })
	, queries = [
		keystone.list('Project').model.find({}).exec(),
		keystone.list('Execution').model.find({}).exec(),
		keystone.list('Image').model.find({}).exec(),
		keystone.list('Video').model.find({}).exec(),
		keystone.list('Document').model.find({}).exec(),
		keystone.list('Brand').model.find({}).exec(),
		keystone.list('Collection').model.find({}).exec(),
		keystone.list('Industry').model.find({}).exec(),
		keystone.list('Location').model.find({}).exec(),
		keystone.list('Person').model.find({}).exec(),
		keystone.list('Platform').model.find({}).exec(),
		keystone.list('Sport').model.find({}).exec()
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
	, tasks = []
	, todo = queries.length;

Bitly.setAccessToken(process.env.BITLY_ACCESS_TOKEN);

function runUpdate (done) {
	async.parallelLimit(tasks, 3, function (err, results){
		if (err){ 
			console.error(err); 
		} else { 
			console.log(results); 
		}
		done(err, results);
	});
}

exports = module.exports = function (done) {

	queries.forEach(function (q){
		q.then(function (documents){
			documents.forEach(function (document){
				tasks.push(saver(document));
			});
			todo--;
			if (!todo) {
				runUpdate(done);
			}
		}, function (err){
			todo--;
			if (!todo) {
				runUpdate(done);
			}
		});
	});

};