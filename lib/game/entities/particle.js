ig.module(
  'game.entities.particle'
)
.requires(
  'impact.entity'
)
.defines(function(){

EntityParticle = ig.Entity.extend({

  size: {x: 8, y: 8},
  offset: {x: 0, y: 0},
  maxVel: {x: 100, y: 100},
  friction: {x:0, y: 0},
  lifetime: 8,
  bounciness: 0,
  name:'empty',

  type: ig.Entity.TYPE.NONE,
  checkAgainst: ig.Entity.TYPE.NONE,
  collides: ig.Entity.COLLIDES.NEVER,

  init: function(x, y, settings) {
    this.parent(x, y, settings);
    this.vel.y = 50;
    this.idleTimer = new ig.Timer();
  },

  update: function() {
    if(this.idleTimer.delta() > this.lifetime) {
      this.kill();
      return;
    }
    this.parent();
  }
});

});