ig.module(
  'game.entities.enemy-pirana'
)
.requires(
  'game.entities.enemy',
  'plugins.tween'
)
.defines(function(){

EntityEnemyPirana = EntityEnemy.extend({

  size: {x:16, y:24},
  offset: {x:0, y:1},
  speed: 35,
  eColour: 0,
  maxVel: {x: 0, y: 0},
  friction: {x: 1000000, y: 1000000},
  jump:0,
  gravityFactor: -1,
  active:true,
  orig: {x:-1, y:-1},
  safetyCollide: false,
  flipY: false,

  move: {
    timer: new ig.Timer(2),
    direction: 0,
    reverse: 0,
    pause: false
  },

  type: ig.Entity.TYPE.B,
  checkAgainst: ig.Entity.TYPE.A,
  collides: ig.Entity.COLLIDES.NEVER,

  animSheet: new ig.AnimationSheet( 'media/sprites/enemy-plant.png', 16,23 ),

  init: function(x, y, settings) {
    this.parent(x, y, settings);
    this.eColour = ig.game.levelType?ig.game.levelType:this.eColour;
    this.addAnim( 'idle', 1, [(this.eColour*2)] );
    this.addAnim( 'moving', 0.15, [(this.eColour*2),(this.eColour*2)+1] );
    this.currentAnim = this.anims.moving;
    this.currentAnim.flip.y = this.flipY;
  },

  ready: function() {
    this.parent();
    this.orig.x = this.pos.x;
    this.orig.y = this.pos.y;
  },

  animate: function() {
    var npos = this.pos.y === this.orig.y ? this.orig.y+(this.flipY?24:-24) : this.orig.y;
    var ndelay = this.pos.y === this.orig.y ? 0 : 1.25;
    var ncomplete = this.pos.y === this.orig.y ? 'animate' : 'startTimer';

    this.vel.x = this.maxVel.x;
    this.tween( {pos: {y: npos}}, 1.25,{delay:ndelay,onComplete:ncomplete}).start();
  },

  startTimer: function(){
    this.move.timer = new ig.Timer(2);
  },

  update: function() {
    if (this.health>0) {
      this.parent();
      if(ig.game.player &&
        ig.game.player.pos.x+ig.game.player.size.x >= this.pos.x-6 &&
        ig.game.player.pos.x <= this.pos.x+this.size.x+6) {
        if(this.pos.y === this.orig.y && ig.game.player.pos.y<this.pos.y && ig.game.player.pos.y>this.pos.y-64) {
          this.move.pause = true;
        }
      } else {
        this.move.pause = false;
      }
      if (this.move.timer) {
        var d = this.move.timer.delta();
        if (d >= 0 && !this.move.pause) {
          this.move.timer=null;
          this.animate();
        }
      }
    }
  },

  check: function(entity) {
    if(entity instanceof EntityPlayer) {
      if(ig.game.invincible) {
        this.superKill();
      } else if (!entity.invisTimer) {
        entity.receiveDamage();
      }
    }
  }
});

});