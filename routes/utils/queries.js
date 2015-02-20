exports = module.exports = {
  defaults: {
    list: function (){
      var doc = { 
        $and: [ 
          { $or: [ { status: 'published' }, { status: 'archived' } ] }
        ] 
      };
      return doc;
    },
    show: function (key){
      var doc = { 
        $and: [ 
          { $or: [ { slug: key } ] }, 
          { $or: [ { status: 'published' }, { status: 'archived' } ] } 
        ] 
      };

      if (key.match(/^[0-9a-fA-F]{24}$/)) {
        doc.$and[0].$or.push({ _id: key });
      }

      return doc;
    }
  }
};