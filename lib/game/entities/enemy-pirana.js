ig.module('game.entities.enemy-pirana')
.requires(
  'game.entities.enemy',
  'plugins.tween'
)
.defines(function() {
  EntityEnemyPirana = EntityEnemy.extend({
    size: { x:16, y:24 },
    offset: { x:0, y:1 },
    speed: 35,
    eColour: 0,
    maxVel: { x: 0, y: 0 },
    friction: { x: 1000000, y: 1000000 },
    jump: 0,
    gravityFactor: -1,
    active: true,
    orig: { x:-1, y:-1 },
    pauseMove: false,
    moveTimer: new ig.Timer(2),
    safetyCollide: false,
    type: ig.Entity.TYPE.B,
    checkAgainst: ig.Entity.TYPE.A,
    collides: ig.Entity.COLLIDES.NEVER,
    animSheet: new ig.AnimationSheet('media/sprites/enemy-plant.png', 16, 23),
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
          this.eColour = 1;
          break;
        default:
          this.eColour = 0;
          break;
      }
      this.addAnim('idle', 1, [0+(this.eColour*2)]);
      this.addAnim('moving', 0.15, [0+(this.eColour*2),1+(this.eColour*2)]);
      this.currentAnim = this.anims.moving;
    },
    ready: function() {
      this.parent();
      this.orig.x = this.pos.x;
      this.orig.y = this.pos.y;
    },
    move: function() {
      var npos = this.pos.y === this.orig.y ? this.orig.y-24 : this.orig.y;
      var ndelay = this.pos.y === this.orig.y ? 0 : 1.25;
      var ncomplete = this.pos.y === this.orig.y ? 'move' : 'startTimer';
      this.tween({
        pos: { y: npos }
      }, 1.25, {
        delay: ndelay,
        onComplete: ncomplete
      }).start();
    },
    startTimer: function(){
      this.moveTimer = new ig.Timer(2);
    },
    update: function() {
      if (this.health > 0) {
        this.parent();
        if (ig.game.player && ig.game.player.pos.x+ig.game.player.size.x>=this.pos.x-6 && ig.game.player.pos.x<=this.pos.x+this.size.x+6) {
          if (
            this.pos.y === this.orig.y &&
            ig.game.player.pos.y < this.pos.y &&
            ig.game.player.pos.y > this.pos.y-64
          ) {
            this.pauseMove = true;
          }
        } else {
          this.pauseMove = false;
        }
        if (this.moveTimer) {
          var d = this.moveTimer.delta();
          if (d >= 0 && !this.pauseMove) {
            this.moveTimer=null;
            this.move();
          }
        }
      }
    },
    check: function(entity) {
      if (entity instanceof EntityPlayer) {
        if (ig.game.invincible) {
          this.superKill();
        }
        else if (!entity.invisTimer) {
          entity.receiveDamage();
        }
      }
    }
  });
});