var _ = require('stackq'), magnus = require('../magnus.js');

var atom = magnus.Component.extends({
  init: function(map,fn){
    this.$super('atom',map,fn);
  },
});

var list = magnus.Component.extends({
  init: function(map){
    this.$super('li',map,function(){
      return this.atom;
    });
  }
});

var data = _.Immutate.transform({
  label: 'i love her',
  name: 'denis',
  date: Date.now(),
});

var denis = list.make({ atom: data.ghost('name') });

var atomic = atom.make({
  atom: data.ghost('label'),
  attr: { id: data.ghost('name') },
  data: { id: data.ghost('date') },
},function(){
  return [this.atom,denis];
});


console.log(magnus.renderHTML(atomic.render()).markup);
console.log(magnus.renderHTML(denis.render()).markup);

data.get().set('label','i hate you');
data.get().set('name','winston');

console.log(magnus.renderHTML(atomic.render()).markup);
console.log(magnus.renderHTML(denis.render()).markup);

