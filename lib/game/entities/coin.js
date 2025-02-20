ig.module('game.entities.coin')
.requires('impact.entity')
.defines(function() {
  EntityCoin = ig.Entity.extend({
    size: { x: 10, y: 14 },
    maxVel: { x: 0, y: 0 },
    friction: { x: 1000000, y: 1000000 },
    gravityFactor:-1,
    eColour: 0,
    type: ig.Entity.TYPE.NONE,
    checkAgainst: ig.Entity.TYPE.A,
    collides: ig.Entity.COLLIDES.LITE,
    animSheet: new ig.AnimationSheet('media/sprites/coin.png', 10, 14),
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
          this.eColour = 2;
          break;
        case 'water':
          this.eColour = 2;
          break;
        case 'castle':
          this.eColour = 1;
          break;
        default:
          this.eColour = 0;
          break;
      }
      this.addAnim('idle', 0.1, [0+(this.eColour*3),1+(this.eColour*3),2+(this.eColour*3)]);
      this.currentAnim = this.anims.idle;
    },
    ready: function() {
      this.parent();
    },
    check: function(entity) {
      this.parent(entity);
      if (entity instanceof EntityPlayer) {
        this.kill();
        ig.game.addCoin();
      }
    },
    update: function() {
      this.parent();
    }
  });
});