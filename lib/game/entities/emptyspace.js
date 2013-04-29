ig.module(
  'game.entities.emptyspace'
)
.requires(
  'impact.entity'
)
.defines(function(){

EntityEmptyspace = ig.Entity.extend({

  _wmDrawBox: true,
  _wmBoxColor: 'rgba(255, 0, 0, 0.7)',
  _wmScalable: true,

  checkAgainst: ig.Entity.TYPE.BOTH,

  update: function() {},

  check: function(other) {
    other.receiveDamage(999);
  }
});

});