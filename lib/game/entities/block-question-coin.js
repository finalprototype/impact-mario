ig.module('game.entities.block-question-coin')
.requires(
  'plugins.tween',
  'game.entities.block',
  'game.entities.particle-coin'
)
.defines(function() {
  EntityBlockQuestionCoin = EntityBlock.extend({
    coins:1,
    init: function(x, y, settings) {
      this.parent(x, y, settings);
      switch(ig.game.levelType) {
        case 'above':
          this.currentAnim = this.anims.questionbrighton;
          break;
        case 'below':
          this.currentAnim = this.anims.questiondarkon;
          break;
        case 'water':
          this.currentAnim = this.anims.questionbrighton;
          break;
        case 'castle':
          this.currentAnim = this.anims.questionbrighton;
          break;
        default:
          this.currentAnim = this.anims.questionbrighton;
          break;
      }
    },
    update: function() {
      this.parent();
    },
    collideWith: function(entity, axis) {
      this.parent(entity, axis);
      if(this.active && axis === 'y' && (entity instanceof EntityPlayer)) {
        if(entity.pos.y > this.pos.y) {
          if(this.coins > 0) {
            if (!this.killTimer) {
              this.killTimer = new ig.Timer(5);
            }
            this.active = false;
            ig.game.spawnEntity(EntityParticleCoin, this.pos.x+4, this.pos.y-20);
            this.bounce();
            this.coins--;
            if (this.killTimer.delta() >= 0) {
              this.coins = 0;
            }
            if (this.coins <= 0) {
              switch (ig.game.levelType) {
                case 'above':
                  this.currentAnim = this.anims.questionbrightoff;
                  break;
                case 'below':
                  this.currentAnim = this.anims.questiondarkoff;
                  break;
                case 'water':
                  this.currentAnim = this.anims.questiondarkoff;
                  break;
                case 'castle':
                  this.currentAnim = this.anims.questiongrayoff;
                  break;
                default:
                  this.currentAnim = this.anims.questionbrightoff;
                  break;
              }
            }
          } else {
            entity.bumpSound.play();
          }
        }
      }
    }
  });
});