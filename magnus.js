/* Released under the MIT license*
 *
 *  This code is released under the mit license and this should 
 *  alwas be include along with any copy or usage or amending of 
 *  the code
 */

var _ = require('stackq');
var grid = require('grids');
module.exports = _.Mask(function(){

  var self = this;

  this.Element = _.Immutate.extends({
    init: function(map){
      _.Asserted(_.valids.Object(map),'an object must be passed as argument');
      _.Asserted(_.valids.String(map.type),'an object must be passed as argument');
      if(_.valids.contains(map,'attr')){
        _.Asserted(_.valids.Object(map['attr']),'attr key must have an object map as value');
      }
      if(_.valids.contains(map,'data')){
        _.Asserted(_.valids.Object(map['data']),'data key must have an object map as value');
      }
      if(_.valids.contains(map,'children')){
        _.Asserted(_.valids.List(map['children']) || _.valids.Primitive(map['children']),'children key must be either a primitive or a list containing only primitive, maps or magnus.Elements');
      }
      this.$super(map);
      this.tag = map.type;
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
         if(f.isValueCursor()) return f.value();
         if(f.isObjectCursor()){
           if(this.Element.instanceBelongs(f.owner)){
             if(done.indexOf(f) !== -1) return;
             done.push(f);
             return this.renderHTML(f.owner).markup;
           }
           //if its not an ELement when build,cache and render
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
  
    // done.length = 0;
    // done = null;

    return {
      elemCache: cache,
      markup: f.values().join('')
    };
  });

  this.unsecure('transformHTMl',function(markup){

  });



});



