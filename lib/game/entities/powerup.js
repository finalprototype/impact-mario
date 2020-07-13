ig.module('game.entities.powerup')
.requires('impact.entity')
.defines(function() {
  EntityPowerup = ig.Entity.extend({
    size: {x: 16, y: 16},
    maxVel: {x: 35, y: 350},
    friction: {x: 0, y: 0},
    orig: {x:-1,y:-1},
    jump: 500,
    gravityFactor: 1,
    speed: 0,
    flip: false,
    active: false,
    direction: 'right',
    eColour: 0,
    type: ig.Entity.TYPE.NONE,
    checkAgainst: ig.Entity.TYPE.A,
    collides: ig.Entity.COLLIDES.LITE,
    animSheet: new ig.AnimationSheet('media/sprites/powerups.png', 16, 16),
    appearsSound: new ig.Sound('media/audio/smb_powerup_appears.ogg', true),
    init: function(x, y, settings) {
      this.parent(x, y, settings);
      switch(ig.game.levelType) {
        case 'above':
          this.eColour = 0;
          break;
        case 'below':
          this.eColour = 1;
          break;
        case 'dark':
          this.eColour = 1;
          break;
        case 'water':
          this.eColour = 0;
          break;
        case 'castle':
          this.eColour = 0;
          break;
        default:
          this.eColour = 0;
          break;
      }
      this.addAnim('mushroom', 10, [8+(this.eColour*1)]);
      this.addAnim('life', 10, [10]);
      this.addAnim('poison', 10, [11]);
      this.addAnim('flower', 0.05, [
        0+(this.eColour*4),
        1+(this.eColour*4),
        2+(this.eColour*4),
        3+(this.eColour*4),
        2+(this.eColour*4),
        1+(this.eColour*4)]
      );
      this.addAnim('star', 0.05, [12,13,14,15]);
      this.appearsSound.play();
      this.deactivate();
      switch(this.direction) {
        case 'left':
          this.flip = false;
          break;
        case 'right':
          this.flip = true;
          break;
        case 'stay':
          this.maxVel.x=0;
          break;
        case 'none':
          this.maxVel.x=0;
          break;
      }
    },
    ready: function() {
      this.parent();
      this.orig.x = this.pos.x;
      this.orig.y = this.pos.y;
    },
    update: function() {
      if(this.active) {
        var xdir = this.flip ? 1 : -1;
        this.vel.x = this.speed * xdir;
      }
      this.parent();
    },
    collideWith: function(entity,axis){
      if(this.active) {
        if(entity instanceof EntityBlock && axis === 'x') {
          this.flip = !this.flip;
        }
      }
      this.parent(entity,axis);
    },
    check: function(entity) {
      this.parent(entity);
    },
    handleMovementTrace: function(res) {
      if(res.collision.x) {
        this.flip = !this.flip;
      }
      this.parent(res);
    },
    deactivate: function() {
      this.active = false;
    },
    activate: function() {
      this.active = true;
    }
  });
});