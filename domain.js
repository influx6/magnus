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
