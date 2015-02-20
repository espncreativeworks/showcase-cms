/**
 * This script automatically creates default Timezones when an
 * empty database is used for the first time. You can use this
 * technique to insert data into any List you have defined.
 * 
 * Alternatively, you can export a custom function for the update:
 * module.exports = function(done) { ... }
 */

// exports.create = {
//   User: [
//     { 'name.first': 'Admin', 'name.last': 'User', email: 'chris.montoro@espn.com', password: 'espn123', isAdmin: true }
//   ]
// };

// This is the long-hand version of the functionality above:

var keystone = require('keystone')
  , async = require('async')
  , tz = require('timezones-json')
  , Timezone = keystone.list('Timezone').model;

var timezones = []; 

tz.timezones.filter(function (collection){
  return !(collection.group === 'Manual Offsets' || collection.group === 'UTC');
}).forEach(function (collection){ 
  var zones = collection.zones;

  zones.forEach(function (_zone){
    var zone = {};
    zone.name = _zone.name;
    zone.group = collection.group;
    zone.code = _zone.value;
    timezones.push(zone);
  });

});

function findOrCreateTimezone(zone, done) {
  
  Timezone.findOne(zone, function (err, _zone){
    if (err){
      console.error('Error adding timezone ' + zone.name + ' to the database: ');
      return done(err);
    }

    if (!_zone){
      _zone = new Timezone(zone);
      _zone.save(function (err, _zone){
        if (err){
          console.error('Error adding timezone ' + zone.name + ' to the database: ');
          return done(err);
        } else {
          console.log('Added timezone ' + _zone.name + ' to the database.');
          done();
        }
      });
    } else {
      done();
    }

  });
  
}

exports = module.exports = function(done) {
  async.eachLimit(timezones, 7, findOrCreateTimezone, done);
};
