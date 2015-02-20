exports = module.exports = {
  populate: function (model, q, req){
    var _populate;

    if ('populate' in req.query){
      if (req.query.populate.indexOf(',') > -1){
        _populate = req.query.populate.split(',').map(function (field){ return field.trim(); }).join(' ');   
      } else {
        _populate = req.query.populate;   
      }
    }

    if (_populate){
      q.populate(_populate);
    }

    return q;
  }
};