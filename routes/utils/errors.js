exports = module.exports = {
  notFound: function (res, data){
    res.status(404).json(data);
  },
  internal: function (res, err){
    res.status(500).json({ name: err.name, message: err.message });
  }
};