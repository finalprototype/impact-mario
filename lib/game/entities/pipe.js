ig.module(
  'game.entities.pipe'
)
.requires(
  'impact.entity'
)
.defines(function(){

EntityPipe = ig.Entity.extend({

  size: {x:28, y:32},
  offset: {x: 2, y: 0},
  maxVel: {x: 0, y: 0},
  friction: {x: 1000000, y: 1000000},
  orig: {x:-1, y:-1},
  gravityFactor: -5,
  flipX: false,
  flipY: false,
  active: true,
  eColour: 0,

  type: ig.Entity.TYPE.A,
  checkAgainst: ig.Entity.TYPE.BOTH,
  collides: ig.Entity.COLLIDES.FIXED,
  animSheet: new ig.AnimationSheet( 'media/pipes.png', 32, 32 ),

  init: function(x, y, settings) {
    this.parent(x, y, settings);
    this.eColour = ig.game.levelType?ig.game.levelType:this.eColour;
  },

  ready: function() {
    this.parent();
    this.orig.x = this.pos.x;
    this.orig.y = this.pos.y;
    this.active = true;
  },

  update: function() {
    this.parent();
  }
});

});