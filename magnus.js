/* Released under the MIT license*
 *
 *  This code is released under the mit license and this should 
 *  alwas be include along with any copy or usage or amending of 
 *  the code
 */
var root = this;

var _ = require('stackq');
var grid = require('grids');
var domain = require('./domain');

//create inplace holder to allow internal server and client usage
var isBrowser = _.valids.contains(root,'window');

var Magnus = _.Mask(function(){

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
      var build = ['<',f], props = [], content = [];
      if(attr){ props.push(' '); props.push(attr.values().join(' ')); }
      if(data){ props.push(' '); props.push(data.values().join(' ')); }
      if(kids) content.push(kids.values().join(' '));
      build.push(props.join(''));
      build.push('>');
      build.push('');
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


  this.Rendering = _.Configurable.extends({
    init: function(comp){
      _.Asserted(self.Component.instanceBelongs(comp),'only magnus.Component instance allowed')
      this.component = comp;
      this.hash = null;
      this.cache = null;
    },
    render: function(){
      if(this.component.hash() === this.hash){
        if(_.valids.exists(this.cache)) return this.cache.markup
        this.cache = self.renderHTML(this.component.element());
        return this.cache.markup;
      }
      this.hash = this.component.hash();
      this.cache = self.renderHTML(this.component.element());
      return this.cache.markup;
    },
  },{
    select: function(comp){
      if(!!isBrowser) return self.ClientRender.make(comp);
      return self.ServerRender.make(comp);
    }
  });

  this.ServerRender = this.Rendering.extends({
    init: function(comp){
      this.$super(comp);
    }
  });

  this.ClientRender = this.Rendering.extends({
    init: function(comp){
      core.Assert(isBrowser,'only works client sided with an html dom');
      this.$super(comp);
      this.fragment = global.document.createElement();
    }
  });

  this.RenderTree = _.Configurable.extends({
    init: function(component){
    },
    render: function(){
      
    },
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

      // if(res.data) res.data.hash = this.atom.hash();
      // else{ res.data = { hash: this.atom.hash() };  };
      var kids = fn.call(this,res);
      domain.ResultType.is(res,function(s,r){
        _.Asserted(s,_.Util.String(' ','result is not a map',_.funcs.toJSON(r)));
      });
      
      if(_.valids.exists(kids)){
        if(_.Cursor.instanceBelongs(kids)) res.children = kids;
        else{
          var rep = _.valids.List(kids) ? kids : [kids];
          res.children = _.Sequence.value(rep).mapobj(function(v){
             if(self.Component.instanceBelongs(v)) return v.element();
             return v;
          }).values();
        }
      };

      //adds component meta details
      this.elem = self.createElement(res,this);
      //add rendering handler and configuration
      this.rendering = self.Rendering.select(this);
      map.type = type;
    },
    element: function(){
      return this.elem;
    },
    hash: function(){
     return this.elem.ghost().sHash();
    },
    data: function(){
      return this.atom;
    },
    render: function(){
      return this.rendering.render();
    },
  });

});


global.Magnus = Magnus;
module.exports = Magnus;
