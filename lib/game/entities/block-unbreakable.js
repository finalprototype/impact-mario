ig.module('game.entities.block-unbreakable')
.requires(
  'plugins.tween',
  'game.entities.block'
)
.defines(function() {
  EntityBlockUnbreakable = EntityBlock.extend({
    init: function(x, y, settings) {
      this.parent(x, y, settings);
      switch(ig.game.levelType) {
        case 'above':
          this.currentAnim = this.anims.unbreakablered;
          break;
        case 'below':
          this.currentAnim = this.anims.unbreakableblue;
          break;
        case 'water':
          this.currentAnim = this.anims.unbreakableblue;
          break;
        case 'castle':
          this.currentAnim = this.anims.unbreakablegray;
          break;
        default:
          this.currentAnim = this.anims.unbreakablered;
          break;
      }
    },
    update: function() {
      this.parent();
    },
    collideWith: function(entity, axis) {
      this.parent(entity, axis);
      if (!this.active && axis === 'y') {
        if(entity.pos.y > this.pos.y) {
          entity.bumpSound.play();
        }
      }
    }
  });
});