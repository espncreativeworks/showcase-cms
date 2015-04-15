var keystone = require('keystone')
  , Brand = keystone.list('Brand').model
  , utils = require('../utils/');

function listBrands(req, res){
  var doc = utils.queries.defaults.list()
    , q;

  q = Brand.find(doc);
  q.sort('sortOrder');

  q.exec().then(function(brands){
    res.status(200).json(brands);
  }, function (err){
    res.status(500).json({ name: err.name, message: err.message });
  });
}

function showBrand(req, res){
  var key = req.params.key
    , doc = utils.queries.defaults.show(key)
    , q;
  
  q = Brand.findOne(doc);
  q = utils.relationships.populate(Brand, q, req);

  q.exec().then(function (brand){
    res.status(200).json(brand);
  }, function (err){
    res.status(500).json({ name: err.name, message: err.message });
  });
}

function createBrand(req, res){
  var doc = req.body
    , q;

  q = Brand.findOrCreate(doc);

  q.then(function(brand){
    res.status(201).json(brand);
  }, function (err){
    res.status(500).status({ name: err.name, message: err.message });
  });
}

exports = module.exports = {
  list: listBrands,
  show: showBrand,
  create: createBrand
};