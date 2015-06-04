exports = module.exports = {
  defaults: {
    list: function (opts){
      var doc = {};
      opts = opts || {};

      if (!('status' in opts) || opts.status === true){
        doc.$and = [ 
          { $or: [ { status: 'published' }, { status: 'archived' } ] }
        ];
      }
      
      return doc;
    },
    show: function (key, opts){
      var doc = { 
        $and: [ 
          { $or: [ { slug: key }, { 'meta.slug': key }, { key: key } ] }
        ] 
      };

      if (!('status' in opts) || opts.status === true){
        doc.$and = [ 
          { $or: [ { status: 'published' }, { status: 'archived' } ] }
        ];
      }

      if (key.match(/^[0-9a-fA-F]{24}$/)) {
        doc.$and[0].$or.push({ _id: key });
      }

      return doc;
    }
  }
};