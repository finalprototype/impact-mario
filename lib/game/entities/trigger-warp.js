ig.module(
  'game.entities.trigger-warp'
)
.requires(
  'impact.entity'
)
.defines(function(){

EntityTriggerWarp = ig.Entity.extend({

  _wmDrawBox: true,
  _wmBoxColor: 'rgba(255, 255, 255, 0.7)',
  _wmScalable: true,

  checkAgainst: ig.Entity.TYPE.A,

  update: function() {},
  check: function(other) {
    if(other instanceof EntityPlayer) {
      ig.game.levelComplete();
    }
  }
});

});