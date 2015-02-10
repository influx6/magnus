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
var _ = require('stackq'), m = require('./magnus.js');



}, {"./magnus.js":2}],
2: [function(require, module, exports) {
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




}, {"./domain":3}],
3: [function(require, module, exports) {
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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInJlcXVpcmUuanMiLCJkb20uanMiLCJtYWdudXMuanMiLCJkb21haW4uanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ25GQTtBQUNBO0FBQ0E7QUFDQTs7O0FDSEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7QUNqS0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gb3V0ZXIobW9kdWxlcywgY2FjaGUsIGVudHJpZXMpe1xuXG4gIC8qKlxuICAgKiBHbG9iYWxcbiAgICovXG5cbiAgdmFyIGdsb2JhbCA9IChmdW5jdGlvbigpeyByZXR1cm4gdGhpczsgfSkoKTtcblxuICAvKipcbiAgICogUmVxdWlyZSBgbmFtZWAuXG4gICAqXG4gICAqIEBwYXJhbSB7U3RyaW5nfSBuYW1lXG4gICAqIEBwYXJhbSB7Qm9vbGVhbn0ganVtcGVkXG4gICAqIEBhcGkgcHVibGljXG4gICAqL1xuXG4gIGZ1bmN0aW9uIHJlcXVpcmUobmFtZSwganVtcGVkKXtcbiAgICBpZiAoY2FjaGVbbmFtZV0pIHJldHVybiBjYWNoZVtuYW1lXS5leHBvcnRzO1xuICAgIGlmIChtb2R1bGVzW25hbWVdKSByZXR1cm4gY2FsbChuYW1lLCByZXF1aXJlKTtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ2Nhbm5vdCBmaW5kIG1vZHVsZSBcIicgKyBuYW1lICsgJ1wiJyk7XG4gIH1cblxuICAvKipcbiAgICogQ2FsbCBtb2R1bGUgYGlkYCBhbmQgY2FjaGUgaXQuXG4gICAqXG4gICAqIEBwYXJhbSB7TnVtYmVyfSBpZFxuICAgKiBAcGFyYW0ge0Z1bmN0aW9ufSByZXF1aXJlXG4gICAqIEByZXR1cm4ge0Z1bmN0aW9ufVxuICAgKiBAYXBpIHByaXZhdGVcbiAgICovXG5cbiAgZnVuY3Rpb24gY2FsbChpZCwgcmVxdWlyZSl7XG4gICAgdmFyIG0gPSBjYWNoZVtpZF0gPSB7IGV4cG9ydHM6IHt9IH07XG4gICAgdmFyIG1vZCA9IG1vZHVsZXNbaWRdO1xuICAgIHZhciBuYW1lID0gbW9kWzJdO1xuICAgIHZhciBmbiA9IG1vZFswXTtcblxuICAgIGZuLmNhbGwobS5leHBvcnRzLCBmdW5jdGlvbihyZXEpe1xuICAgICAgdmFyIGRlcCA9IG1vZHVsZXNbaWRdWzFdW3JlcV07XG4gICAgICByZXR1cm4gcmVxdWlyZShkZXAgPyBkZXAgOiByZXEpO1xuICAgIH0sIG0sIG0uZXhwb3J0cywgb3V0ZXIsIG1vZHVsZXMsIGNhY2hlLCBlbnRyaWVzKTtcblxuICAgIC8vIGV4cG9zZSBhcyBgbmFtZWAuXG4gICAgaWYgKG5hbWUpIGNhY2hlW25hbWVdID0gY2FjaGVbaWRdO1xuXG4gICAgcmV0dXJuIGNhY2hlW2lkXS5leHBvcnRzO1xuICB9XG5cbiAgLyoqXG4gICAqIFJlcXVpcmUgYWxsIGVudHJpZXMgZXhwb3NpbmcgdGhlbSBvbiBnbG9iYWwgaWYgbmVlZGVkLlxuICAgKi9cblxuICBmb3IgKHZhciBpZCBpbiBlbnRyaWVzKSB7XG4gICAgaWYgKGVudHJpZXNbaWRdKSB7XG4gICAgICBnbG9iYWxbZW50cmllc1tpZF1dID0gcmVxdWlyZShpZCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJlcXVpcmUoaWQpO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBEdW8gZmxhZy5cbiAgICovXG5cbiAgcmVxdWlyZS5kdW8gPSB0cnVlO1xuXG4gIC8qKlxuICAgKiBFeHBvc2UgY2FjaGUuXG4gICAqL1xuXG4gIHJlcXVpcmUuY2FjaGUgPSBjYWNoZTtcblxuICAvKipcbiAgICogRXhwb3NlIG1vZHVsZXNcbiAgICovXG5cbiAgcmVxdWlyZS5tb2R1bGVzID0gbW9kdWxlcztcblxuICAvKipcbiAgICogUmV0dXJuIG5ld2VzdCByZXF1aXJlLlxuICAgKi9cblxuICAgcmV0dXJuIHJlcXVpcmU7XG59KSIsInZhciBfID0gcmVxdWlyZSgnc3RhY2txJyksIG0gPSByZXF1aXJlKCcuL21hZ251cy5qcycpO1xuXG5cbiIsIi8qIFJlbGVhc2VkIHVuZGVyIHRoZSBNSVQgbGljZW5zZSpcbiAqXG4gKiAgVGhpcyBjb2RlIGlzIHJlbGVhc2VkIHVuZGVyIHRoZSBtaXQgbGljZW5zZSBhbmQgdGhpcyBzaG91bGQgXG4gKiAgYWx3YXMgYmUgaW5jbHVkZSBhbG9uZyB3aXRoIGFueSBjb3B5IG9yIHVzYWdlIG9yIGFtZW5kaW5nIG9mIFxuICogIHRoZSBjb2RlXG4gKi9cblxudmFyIF8gPSByZXF1aXJlKCdzdGFja3EnKTtcbnZhciBncmlkID0gcmVxdWlyZSgnZ3JpZHMnKTtcbnZhciBkb21haW4gPSByZXF1aXJlKCcuL2RvbWFpbicpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IF8uTWFzayhmdW5jdGlvbigpe1xuXG4gIHZhciBzZWxmID0gdGhpcztcblxuICB0aGlzLkVsZW1lbnQgPSBfLkltbXV0YXRlLmV4dGVuZHMoe1xuICAgIGluaXQ6IGZ1bmN0aW9uKG1hcCxjb21wb25lbnQpe1xuICAgICAgZG9tYWluLkVsZW1lbnRUeXBlLmlzKG1hcCxmdW5jdGlvbihzLHIpe1xuICAgICAgICBfLkFzc2VydGVkKHMsXy5VdGlsLlN0cmluZygnICcsXy5VdGlsLnRvSlNPTihyKSwnZG9lcyBub3QgbWF0Y2ggY3JpdGVyYSBmb3IgZWxlbSBjcmVhdGlvbicpKTtcbiAgICAgIH0pO1xuXG4gICAgICB0aGlzLiRzdXBlcihtYXApO1xuICAgICAgdGhpcy50YWcgPSBtYXAudHlwZTtcbiAgICAgIHRoaXMuY29tcG9uZW50ID0gY29tcG9uZW50O1xuICAgIH0sXG4gICAgaXNFbGVtZW50OiBmdW5jdGlvbigpe1xuICAgICAgcmV0dXJuIHRydWU7XG4gICAgfSxcbiAgfSk7XG5cbiAgdGhpcy51bnNlY3VyZSgndGFnTWl4ZXInLGZ1bmN0aW9uKHQsZngsam9pbmEpe1xuICAgIHJldHVybiB0aGlzLmJpbmQoZnVuY3Rpb24oZix2KXtcbiAgICAgIHZhciBqID0gW3Qsdl0uam9pbihqb2luYSk7XG4gICAgICByZXR1cm4gZnguY2FsbCh0aGlzLGosZik7XG4gICAgfSk7XG4gIH0pO1xuXG4gIHRoaXMudW5zZWN1cmUoJ2NyZWF0ZUVsZW1lbnQnLGZ1bmN0aW9uKG1hcCl7XG4gICAgcmV0dXJuIHRoaXMuRWxlbWVudC5tYWtlKG1hcCk7XG4gIH0pO1xuXG4gIHRoaXMudW5zZWN1cmUoJ3JlbmRlckhUTUwnLGZ1bmN0aW9uKGVsZW0pe1xuICAgIHZhciBjYWNoZSA9IHt9LGRvbmUgPSBbXSx0YWcgPSBlbGVtLnNuYXBzaG90KCd0eXBlJyk7XG4gICAgXG4gICAgdmFyIGF0dHIgPSBlbGVtLnNuYXBzaG90KCdhdHRyJyx0aGlzLmJpbmQoZnVuY3Rpb24oYXR0cil7XG4gICAgICByZXR1cm4gYXR0ci5tYXAodGhpcy50YWdNaXhlcignJyxmdW5jdGlvbiBlcXVhKG50LGYpe1xuICAgICAgICBpZihmLmlzVmFsdWVDdXJzb3IoKSkgcmV0dXJuIFtudCxfLmZ1bmNzLmRvdWJsZVF1b3RlKGYudmFsdWUoKSldLmpvaW4oJz0nKTtcbiAgICAgICAgcmV0dXJuIGYubWFwKHRoaXMudGFnTWl4ZXIobnQsZXF1YSwnLScpKS52YWx1ZXMoKS5qb2luKCcgJyk7XG4gICAgICB9LCcnKSk7XG4gICAgfSkpO1xuXG4gICAgdmFyIGRhdGEgPSBlbGVtLnNuYXBzaG90KCdkYXRhJyx0aGlzLmJpbmQoZnVuY3Rpb24oZGF0YSl7XG4gICAgICByZXR1cm4gZGF0YS5tYXAodGhpcy50YWdNaXhlcignZGF0YScsZnVuY3Rpb24gZXF1YShudCxmKXtcbiAgICAgICAgaWYoZi5pc1ZhbHVlQ3Vyc29yKCkpIHJldHVybiBbbnQsXy5mdW5jcy5kb3VibGVRdW90ZShmLnZhbHVlKCkpXS5qb2luKCc9Jyk7XG4gICAgICAgIHJldHVybiBmLm1hcCh0aGlzLnRhZ01peGVyKG50LGVxdWEsJy0nKSkudmFsdWVzKCkuam9pbignICcpO1xuICAgICAgfSwnLScpKTtcbiAgICB9KSk7XG5cbiAgICB2YXIga2lkcyA9IGVsZW0uc25hcHNob3QoJ2NoaWxkcmVuJyx0aGlzLmJpbmQoZnVuY3Rpb24oa2lkcyl7XG4gICAgICAgcmV0dXJuIGtpZHMubWFwKHRoaXMuYmluZChmdW5jdGlvbihmKXtcblxuICAgICAgICAgaWYoXy52YWxpZHMuaXNQcmltaXRpdmUoZikpIHJldHVybiBmO1xuXG4gICAgICAgICB2YXIgaXNjID0gXy5HaG9zdEN1cnNvci5pbnN0YW5jZUJlbG9uZ3MoZik7XG4gICAgICAgICAvLyBjb25zb2xlLmxvZygncmVuZGVyaW5nIGtpZHMnLCdpcyBnaG9zdDonLGlzYyxmLmlzVmFsdWVDdXJzb3IoKSk7XG5cbiAgICAgICAgIGlmKGYuaXNWYWx1ZUN1cnNvcigpKSByZXR1cm4gZi52YWx1ZSgpO1xuICAgICAgICAgaWYoZi5pc09iamVjdEN1cnNvcigpKXtcblxuICAgICAgICAgICBpZih0aGlzLkVsZW1lbnQuaW5zdGFuY2VCZWxvbmdzKGYub3duZXIpKXtcbiAgICAgICAgICAgICBpZihkb25lLmluZGV4T2YoZikgIT09IC0xKSByZXR1cm47XG4gICAgICAgICAgICAgZG9uZS5wdXNoKGYpO1xuICAgICAgICAgICAgIHJldHVybiB0aGlzLnJlbmRlckhUTUwoZi5vd25lcikubWFya3VwO1xuICAgICAgICAgICB9XG5cbiAgICAgICAgICAgLy9pZiBpdHMgbm90IGFuIEVsZW1lbnQgd2hlbiBidWlsZCxjYWNoZSBhbmQgcmVuZGVyXG4gICAgICAgICAgIHZhciBlbCxtYXAgPSBmLnZhbHVlKCk7XG4gICAgICAgICAgIGlmKF8udmFsaWRzLmNvbnRhaW5zKGNhY2hlLG1hcCkpIHJldHVybjtcbiAgICAgICAgICAgICAvLyByZXR1cm4gdGhpcy5yZW5kZXJIVE1MKGNhY2hlW21hcF0pLm1hcmt1cDtcbiAgICAgICAgICAgdHJ5e1xuICAgICAgICAgICAgIGVsID0gdGhpcy5jcmVhdGVFbGVtZW50KG1hcCk7XG4gICAgICAgICAgICAgY2FjaGVbbWFwXSA9IGVsO1xuICAgICAgICAgICB9Y2F0Y2goZSl7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgIH1cbiAgICAgICAgICAgaWYoZWwpIHJldHVybiB0aGlzLnJlbmRlckhUTUwoZWwpLm1hcmt1cDtcbiAgICAgICAgIH1cbiAgICAgICB9KSk7XG4gICAgfSkpO1xuXG5cbiAgICB2YXIgZiA9IHRhZy5tYXAoZnVuY3Rpb24oZil7XG4gICAgICB2YXIgYnVpbGQgPSBbJzwnLGYsJyAnXSwgcHJvcHMgPSBbXSwgY29udGVudCA9IFtdO1xuICAgICAgaWYoYXR0cikgcHJvcHMucHVzaChhdHRyLnZhbHVlcygpLmpvaW4oJyAnKSk7XG4gICAgICBpZihkYXRhKSBwcm9wcy5wdXNoKGRhdGEudmFsdWVzKCkuam9pbignICcpKTtcbiAgICAgIGlmKGtpZHMpIGNvbnRlbnQucHVzaChraWRzLnZhbHVlcygpLmpvaW4oJyAnKSk7XG4gICAgICBidWlsZC5wdXNoKHByb3BzLmpvaW4oJyAnKSk7XG4gICAgICBidWlsZC5wdXNoKCc+Jyk7XG4gICAgICBidWlsZC5wdXNoKCcgJyk7XG4gICAgICBidWlsZC5wdXNoKGNvbnRlbnQuam9pbignICcpKTtcbiAgICAgIGJ1aWxkLnB1c2goWyc8LycsZiwnPiddLmpvaW4oJycpKVxuICAgICAgcmV0dXJuIGJ1aWxkLmpvaW4oJycpO1xuICAgIH0pO1xuICBcbiAgICByZXR1cm4ge1xuICAgICAgZWxlbUNhY2hlOiBjYWNoZSxcbiAgICAgIG1hcmt1cDogZi52YWx1ZXMoKS5qb2luKCcnKVxuICAgIH07XG4gIH0pO1xuXG4gIHRoaXMudW5zZWN1cmUoJ3RyYW5zZm9ybUhUTWwnLGZ1bmN0aW9uKG1hcmt1cCl7XG4gIH0pO1xuXG5cbiAgdGhpcy5Db21wb25lbnQgPSBfLkNvbmZpZ3VyYWJsZS5leHRlbmRzKHtcbiAgICBpbml0OiBmdW5jdGlvbih0eXBlLG1hcCxmbil7XG4gICAgICBkb21haW4uQ29tcG9uZW50QXJnLmlzKG1hcCxmdW5jdGlvbihzLHIpe1xuICAgICAgICBfLkFzc2VydGVkKHMsXy5VdGlsLlN0cmluZygnICcsJ21hcCBkb2VzIG5vdCBtYXRjaCBjb21wb25lbnQgY3JpdGVyYTogJytfLlV0aWwudG9KU09OKHIpKSk7XG4gICAgICB9KTtcbiAgICAgIHRoaXMubWFwID0gbWFwO1xuICAgICAgdGhpcy50eXBlID0gdHlwZTtcbiAgICAgIHRoaXMuYXRvbSA9IG1hcC5hdG9tO1xuICAgICAgXG4gICAgICB2YXIgcmVzID0ge307XG4gICAgICByZXMudHlwZSA9IHRoaXMudHlwZTtcbiAgICAgIGlmKG1hcC5hdHRyKSByZXMuYXR0ciA9IHRoaXMubWFwLmF0dHI7XG4gICAgICBpZihtYXAuZGF0YSkgcmVzLmRhdGEgPSB0aGlzLm1hcC5kYXRhO1xuXG4gICAgICB2YXIga2lkcyA9IGZuLmNhbGwodGhpcyxyZXMpO1xuICAgICAgZG9tYWluLlJlc3VsdFR5cGUuaXMocmVzLGZ1bmN0aW9uKHMscil7XG4gICAgICAgIF8uQXNzZXJ0ZWQocyxfLlV0aWwuU3RyaW5nKCcgJywncmVzdWx0IGlzIG5vdCBhIG1hcCcsXy5mdW5jcy50b0pTT04ocikpKTtcbiAgICAgIH0pO1xuICAgICAgXG4gICAgICBpZihfLnZhbGlkcy5leGlzdHMoa2lkcykpe1xuICAgICAgICBpZihfLnZhbGlkcy5Db2xsZWN0aW9uKGtpZHMpKXtcbiAgICAgICAgICByZXMuY2hpbGRyZW4gPSBfLlNlcXVlbmNlLnZhbHVlKGtpZHMpLm1hcG9iaihmdW5jdGlvbih2KXtcbiAgICAgICAgICAgICBpZihzZWxmLkNvbXBvbmVudC5pbnN0YW5jZUJlbG9uZ3ModikpIHJldHVybiB2LnJlbmRlcigpO1xuICAgICAgICAgICAgIHJldHVybiB2O1xuICAgICAgICAgIH0pLnZhbHVlcygpO1xuICAgICAgICB9ZWxzZXtcbiAgICAgICAgICByZXMuY2hpbGRyZW4gPSBraWRzO1xuICAgICAgICB9XG4gICAgICB9XG5cblxuICAgICAgLy9hZGRzIGNvbXBvbmVudCBtZXRhIGRldGFpbHNcbiAgICAgIHRoaXMuZWxlbSA9IHNlbGYuY3JlYXRlRWxlbWVudChyZXMsdGhpcyk7XG4gICAgICBtYXAudHlwZSA9IHR5cGU7XG4gICAgfSxcbiAgICBkYXRhOiBmdW5jdGlvbigpe1xuICAgICAgcmV0dXJuIHRoaXMuYXRvbTtcbiAgICB9LFxuICAgIHJlbmRlcjogZnVuY3Rpb24oKXtcbiAgICAgIHJldHVybiB0aGlzLmVsZW07XG4gICAgfSxcbiAgfSk7XG5cbn0pO1xuXG5cblxuIiwidmFyIF8gPSByZXF1aXJlKCdzdGFja3EnKTtcbnZhciBkb21haW4gPSBtb2R1bGUuZXhwb3J0cyA9IHt9O1xuXG5kb21haW4uaXNHaG9zdCA9IF8uQ2hlY2tlci5UeXBlKGZ1bmN0aW9uKG4pe1xuICByZXR1cm4gXy5HaG9zdEN1cnNvci5pbnN0YW5jZUJlbG9uZ3Mobik7XG59LF8udmFsaWRzLk9iamVjdCk7XG5cbmRvbWFpbi5SZXN1bHRUeXBlID0gXy5DaGVja2VyLm9yVHlwZShfLnZhbGlkcy5QcmltaXRpdmUsXy52YWxpZHMuT2JqZWN0LF8udmFsaWRzLkxpc3QpO1xuXG5kb21haW4uQ29tcG9uZW50QXJnID0gXy5DaGVja2VyKHtcbiAgYXRvbTogXy5HaG9zdEN1cnNvci5pbnN0YW5jZUJlbG9uZ3MsXG4gIGRhdGE6IF8uZnVuY3MubWF5YmUoXy52YWxpZHMuT2JqZWN0KSxcbiAgYXR0cjogXy5mdW5jcy5tYXliZShfLnZhbGlkcy5PYmplY3QpLFxufSk7XG5cbmRvbWFpbi5FbGVtZW50VHlwZSA9IF8uQ2hlY2tlcih7XG4gIHR5cGU6IF8udmFsaWRzLlN0cmluZyxcbiAgZGF0YTogXy5mdW5jcy5tYXliZShfLnZhbGlkcy5PYmplY3QpLFxuICBhdHRyOiBfLmZ1bmNzLm1heWJlKF8udmFsaWRzLk9iamVjdCksXG59KTtcbiJdfQ==
}, {"./magnus.js":2,"./domain":3}],
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

}, {"./domain":3}],
3: [function(require, module, exports) {
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
