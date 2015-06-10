/**
 * This script simply saves all documents in the below lists.
 * Used to trigger Mongoose middleware / Keystone watched field generated values.
 * 
 */

var keystone = require('keystone'),
	async = require('async'),
	models = [
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
	], 
	saver = function (document){
		return function (callback){
			document.save(callback);
		};
	}, 
	tasks = [];

models.forEach(function (Model){
	Model.find({}).exec().then(function (documents){
		documents.forEach(function (document){
			tasks.push(saver(document));
		});
	});
});

exports = module.exports = function (done) {
	async.parallelLimit(tasks, 7, done);
};