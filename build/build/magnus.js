(function outer(modules, cache, entries){

  /**
   * Global
   */

  var global = (function(){ return this; })();

  /**
   * Require `name`.
   *
   * @param {String} name
   * @param {Boolean} jumped
   * @api public
   */

  function require(name, jumped){
    if (cache[name]) return cache[name].exports;
    if (modules[name]) return call(name, require);
    throw new Error('cannot find module "' + name + '"');
  }

  /**
   * Call module `id` and cache it.
   *
   * @param {Number} id
   * @param {Function} require
   * @return {Function}
   * @api private
   */

  function call(id, require){
    var m = cache[id] = { exports: {} };
    var mod = modules[id];
    var name = mod[2];
    var fn = mod[0];

    fn.call(m.exports, function(req){
      var dep = modules[id][1][req];
      return require(dep ? dep : req);
    }, m, m.exports, outer, modules, cache, entries);

    // expose as `name`.
    if (name) cache[name] = cache[id];

    return cache[id].exports;
  }

  /**
   * Require all entries exposing them on global if needed.
   */

  for (var id in entries) {
    if (entries[id]) {
      global[entries[id]] = require(id);
    } else {
      require(id);
    }
  }

  /**
   * Duo flag.
   */

  require.duo = true;

  /**
   * Expose cache.
   */

  require.cache = cache;

  /**
   * Expose modules
   */

  require.modules = modules;

  /**
   * Return newest require.
   */

   return require;
})({
1: [function(require, module, exports) {
(function outer(modules, cache, entries){

  /**
   * Global
   */

  var global = (function(){ return this; })();

  /**
   * Require `name`.
   *
   * @param {String} name
   * @param {Boolean} jumped
   * @api public
   */

  function require(name, jumped){
    if (cache[name]) return cache[name].exports;
    if (modules[name]) return call(name, require);
    throw new Error('cannot find module "' + name + '"');
  }

  /**
   * Call module `id` and cache it.
   *
   * @param {Number} id
   * @param {Function} require
   * @return {Function}
   * @api private
   */

  function call(id, require){
    var m = cache[id] = { exports: {} };
    var mod = modules[id];
    var name = mod[2];
    var fn = mod[0];

    fn.call(m.exports, function(req){
      var dep = modules[id][1][req];
      return require(dep ? dep : req);
    }, m, m.exports, outer, modules, cache, entries);

    // expose as `name`.
    if (name) cache[name] = cache[id];

    return cache[id].exports;
  }

  /**
   * Require all entries exposing them on global if needed.
   */

  for (var id in entries) {
    if (entries[id]) {
      global[entries[id]] = require(id);
    } else {
      require(id);
    }
  }

  /**
   * Duo flag.
   */

  require.duo = true;

  /**
   * Expose cache.
   */

  require.cache = cache;

  /**
   * Expose modules
   */

  require.modules = modules;

  /**
   * Return newest require.
   */

   return require;
})({
1: [function(require, module, exports) {
/* Released under the MIT license*
 *
 *  This code is released under the mit license and this should 
 *  alwas be include along with any copy or usage or amending of 
 *  the code
 */

var _ = require('stackq');
var grid = require('grids');
var domain = require('./domain');

module.exports = _.Mask(function(){

  var self = this;

  this.Element = _.Immutate.extends({
    init: function(map,component){
      domain.ElementType.is(map,function(s,r){
        _.Asserted(s,_.Util.String(' ',_.Util.toJSON(r),'does not match critera for elem creation'));
      });

      this.$super(map);
      this.tag = map.type;
      this.component = component;
    },
    isElement: function(){
      return true;
    },
  });

  this.unsecure('tagMixer',function(t,fx,joina){
    return this.bind(function(f,v){
      var j = [t,v].join(joina);
      return fx.call(this,j,f);
    });
  });

  this.unsecure('createElement',function(map){
    return this.Element.make(map);
  });

  this.unsecure('renderHTML',function(elem){
    var cache = {},done = [],tag = elem.snapshot('type');
    
    var attr = elem.snapshot('attr',this.bind(function(attr){
      return attr.map(this.tagMixer('',function equa(nt,f){
        if(f.isValueCursor()) return [nt,_.funcs.doubleQuote(f.value())].join('=');
        return f.map(this.tagMixer(nt,equa,'-')).values().join(' ');
      },''));
    }));

    var data = elem.snapshot('data',this.bind(function(data){
      return data.map(this.tagMixer('data',function equa(nt,f){
        if(f.isValueCursor()) return [nt,_.funcs.doubleQuote(f.value())].join('=');
        return f.map(this.tagMixer(nt,equa,'-')).values().join(' ');
      },'-'));
    }));

    var kids = elem.snapshot('children',this.bind(function(kids){
       return kids.map(this.bind(function(f){

         if(_.valids.isPrimitive(f)) return f;

         var isc = _.GhostCursor.instanceBelongs(f);
         // console.log('rendering kids','is ghost:',isc,f.isValueCursor());

         if(f.isValueCursor()) return f.value();
         if(f.isObjectCursor()){

           if(this.Element.instanceBelongs(f.owner)){
             if(done.indexOf(f) !== -1) return;
             done.push(f);
             return this.renderHTML(f.owner).markup;
           }

           //if its not an Element when build,cache and render
           var el,map = f.value();
           if(_.valids.contains(cache,map)) return;
             // return this.renderHTML(cache[map]).markup;
           try{
             el = this.createElement(map);
             cache[map] = el;
           }catch(e){
            return;
           }
           if(el) return this.renderHTML(el).markup;
         }
       }));
    }));


    var f = tag.map(function(f){
      var build = ['<',f,' '], props = [], content = [];
      if(attr) props.push(attr.values().join(' '));
      if(data) props.push(data.values().join(' '));
      if(kids) content.push(kids.values().join(' '));
      build.push(props.join(' '));
      build.push('>');
      build.push(' ');
      build.push(content.join(' '));
      build.push(['</',f,'>'].join(''))
      return build.join('');
    });
  
    return {
      elemCache: cache,
      markup: f.values().join('')
    };
  });

  this.unsecure('transformHTMl',function(markup){
  });


  this.Component = _.Configurable.extends({
    init: function(type,map,fn){
      domain.ComponentArg.is(map,function(s,r){
        _.Asserted(s,_.Util.String(' ','map does not match component critera: '+_.Util.toJSON(r)));
      });
      this.map = map;
      this.type = type;
      this.atom = map.atom;
      
      var res = {};
      res.type = this.type;
      if(map.attr) res.attr = this.map.attr;
      if(map.data) res.data = this.map.data;

      var kids = fn.call(this,res);
      domain.ResultType.is(res,function(s,r){
        _.Asserted(s,_.Util.String(' ','result is not a map',_.funcs.toJSON(r)));
      });
      
      if(_.valids.exists(kids)){
        if(_.valids.Collection(kids)){
          res.children = _.Sequence.value(kids).mapobj(function(v){
             if(self.Component.instanceBelongs(v)) return v.render();
             return v;
          }).values();
        }else{
          res.children = kids;
        }
      }


      //adds component meta details
      this.elem = self.createElement(res,this);
      map.type = type;
    },
    data: function(){
      return this.atom;
    },
    render: function(){
      return this.elem;
    },
  });

});




}, {"./domain":2}],
2: [function(require, module, exports) {
var _ = require('stackq');
var domain = module.exports = {};

domain.isGhost = _.Checker.Type(function(n){
  return _.GhostCursor.instanceBelongs(n);
},_.valids.Object);

domain.ResultType = _.Checker.orType(_.valids.Primitive,_.valids.Object,_.valids.List);

domain.ComponentArg = _.Checker({
  atom: _.GhostCursor.instanceBelongs,
  data: _.funcs.maybe(_.valids.Object),
  attr: _.funcs.maybe(_.valids.Object),
});

domain.ElementType = _.Checker({
  type: _.valids.String,
  data: _.funcs.maybe(_.valids.Object),
  attr: _.funcs.maybe(_.valids.Object),
});

}, {}]}, {}, {"1":""})

}, {"./domain":2}],
2: [function(require, module, exports) {
(function outer(modules, cache, entries){

  /**
   * Global
   */

  var global = (function(){ return this; })();

  /**
   * Require `name`.
   *
   * @param {String} name
   * @param {Boolean} jumped
   * @api public
   */

  function require(name, jumped){
    if (cache[name]) return cache[name].exports;
    if (modules[name]) return call(name, require);
    throw new Error('cannot find module "' + name + '"');
  }

  /**
   * Call module `id` and cache it.
   *
   * @param {Number} id
   * @param {Function} require
   * @return {Function}
   * @api private
   */

  function call(id, require){
    var m = cache[id] = { exports: {} };
    var mod = modules[id];
    var name = mod[2];
    var fn = mod[0];

    fn.call(m.exports, function(req){
      var dep = modules[id][1][req];
      return require(dep ? dep : req);
    }, m, m.exports, outer, modules, cache, entries);

    // expose as `name`.
    if (name) cache[name] = cache[id];

    return cache[id].exports;
  }

  /**
   * Require all entries exposing them on global if needed.
   */

  for (var id in entries) {
    if (entries[id]) {
      global[entries[id]] = require(id);
    } else {
      require(id);
    }
  }

  /**
   * Duo flag.
   */

  require.duo = true;

  /**
   * Expose cache.
   */

  require.cache = cache;

  /**
   * Expose modules
   */

  require.modules = modules;

  /**
   * Return newest require.
   */

   return require;
})({
1: [function(require, module, exports) {
var _ = require('stackq');
var domain = module.exports = {};

domain.isGhost = _.Checker.Type(function(n){
  return _.GhostCursor.instanceBelongs(n);
},_.valids.Object);

domain.ResultType = _.Checker.orType(_.valids.Primitive,_.valids.Object,_.valids.List);

domain.ComponentArg = _.Checker({
  atom: _.GhostCursor.instanceBelongs,
  data: _.funcs.maybe(_.valids.Object),
  attr: _.funcs.maybe(_.valids.Object),
});

domain.ElementType = _.Checker({
  type: _.valids.String,
  data: _.funcs.maybe(_.valids.Object),
  attr: _.funcs.maybe(_.valids.Object),
});

}, {}]}, {}, {"1":""})

}, {}]}, {}, {"1":""})
