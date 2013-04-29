ig.module(
  'game.entities.enemy'
)
.requires(
  'impact.entity'
)
.defines(function(){

EntityEnemy = ig.Entity.extend({

  size: {x:14, y:15},
  offset: {x: 1, y: 1},
  maxVel: {x: 100, y: 500},
  friction: {x: 0, y: -30},
  jump: 500,
  jumping : false,
  jumpcount : 0,
  gravityFactor:1,
  accelGround: 600,
  accelAir: 200,
  flip: false,
  speed: 35,
  active: true,
  onscreen: true,
  safetyCollide: true,
  health: 1,

  type: ig.Entity.TYPE.B,
  checkAgainst: ig.Entity.TYPE.BOTH,
  collides: ig.Entity.COLLIDES.SEMI,

  stompSound: new ig.Sound('media/smb_stomp.ogg', true),
  kickSound: new ig.Sound('media/smb_kick.ogg', true),
  bumpSound: new ig.Sound('media/smb_bump.ogg', true),

  init: function(x, y, settings) {
    this.parent(x, y, settings);
  },

  update: function() {
    if (ig.game.player &&
      (ig.game.player.pos.x+ig.system.width/1.2 > this.pos.x && ig.game.player.pos.x-ig.system.width/1.2 < this.pos.x)){
      this.onscreen=true;
    } else {
      this.onscreen = false;
    }
    if (this.onscreen) {
      if (this.active && this.health > 0) {
        var xdir = this.flip ? 1 : -1;
        this.vel.x = this.speed * xdir;
        this.currentAnim.flip.x = this.flip;
        if(this.killTimer && this.killTimer.delta() >= 0) {
          this.kill();
        }
        if(this.pos.y >= 3000) {
          this.kill();
        }
        this.parent();
      } else if (ig.game.isFrozen && !ig.game.isPaused) {
        this.currentAnim.update();
      }

      if (this.safetyCollide && ig.game.collisionMap.getTile(this.pos.x+this.size.x/2, this.pos.y+this.size.y/2)) {
        this.pos.y = this.pos.y+this.size.y;
      }
    }

    if (this.pos.y > ig.system.height+500) {
      this.kill();
    }
  },

  draw: function() {
    if (this.onscreen) {
        this.parent();
    }
  },

  collideWith: function(entity,axis) {
    this.parent(entity,axis);
    if (this.active && !this.killTimer) {
      if (entity instanceof EntityPlayer === false) {
        if (axis === 'x') {
          this.flip = !this.flip;
        }
      }
    }
  },

  handleMovementTrace: function( res ) {
    if (res.collision.x) {
      this.flip = !this.flip;
    }
    this.parent(res);
  },

  kill: function() {
    this.parent();
  },

  superKill: function() {
    this.type = ig.Entity.TYPE.NONE;
    this.checkAgainst = ig.Entity.TYPE.NONE;
    this.collides = ig.Entity.COLLIDES.NEVER;
    this.currentAnim = this.anims.idle;
    this.currentAnim.flip.y = true;
    this.friction = {x: 0, y: -30};
    this.speed = 35;
    this.vel.y = -140;
    this.size.x = -9999;
    this.size.y = -9999;
    this.offset.x = 0;
    this.offset.y = 0;
    this.kickSound.play();
  }
});

});