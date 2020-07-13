ig.module('game.entities.powerup-star')
.requires(
  'plugins.tween',
  'game.entities.powerup',
  'game.entities.player'
)
.defines(function() {
  EntityPowerupStar = EntityPowerup.extend({
    bounciness:4,
    init: function(x, y, settings) {
      this.parent(x, y, settings);
      this.currentAnim = this.anims.star;
      this.collides = ig.Entity.COLLIDES.NEVER;
      this.zIndex = -10;
      var tween1 = this.tween({
        pos: { y: this.pos.y-16 }
      }, 1, {});
      var tween2 = this.tween({
        speed: this.maxVel.x,
        collides: ig.Entity.COLLIDES.LITE,
        active: true
      }, 0, {});
      tween1.chain(tween2);
      tween1.start();
    },
    ready: function() {
      this.parent();
    },
    check: function(entity) {
      this.parent(entity);
      if(this.active && (entity instanceof EntityPlayer)) {
        entity.getInvincibility();
        this.kill();
        console.log('invincible!');
      }
    },
    update: function() {
      this.parent();
    }
  });
});