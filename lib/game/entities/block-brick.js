ig.module(
  'game.entities.block-brick'
)
.requires(
  'plugins.tween',
  'game.entities.block',
  'game.entities.particle-brick',
  'game.entities.player',
  'game.entities.particle-coin',
  'game.entities.powerup-mushroom',
  'game.entities.powerup-life',
  'game.entities.powerup-flower',
  'game.entities.powerup-star'
)
.defines(function() {
  EntityBlockBrick = EntityBlock.extend({
  coins: -1,
  power: null,
  items: 1,
  top: false,
  direction: 'random',
    breakSound: new ig.Sound('media/audio/smb_breakblock.ogg',true),
    init: function(x, y, settings){
      this.parent(x, y, settings);
      switch(ig.game.levelType){
        case 'below':
          this.currentAnim = this.top ? this.anims.brickbluetop : this.anims.brickblue;
          break;
        case 'water':
          this.currentAnim = this.top ? this.anims.brickbluetop : this.anims.brickblue;
          break;
        case 'castle':
          this.currentAnim = this.top ? this.anims.brickgraytop : this.anims.brickgray;
          break;
        default:
          this.currentAnim = this.top ? this.anims.brickredtop : this.anims.brickred;
          break;
      }
      if (this.direction === 'random') {
        this.direction = (Math.random() > 0.2) ? 'right' : 'left';
      }
    },
    update: function() {
      this.parent();
    },
    collideWith: function(entity,axis) {
      this.parent(entity,axis);

      if (this.active && axis === 'y' && (entity instanceof EntityPlayer)) {
        if (entity.pos.y > this.pos.y){
          if (this.power) {
            if (this.items > 0) {
              switch (this.power) {
                case 'life':
                  this.powerEntity = EntityPowerupLife;
                  break;
                case 'grow':
                  this.powerEntity = (ig.game.super === 0) ? EntityPowerupMushroom : EntityPowerupFlower;
                  break;
                case 'star':
                  this.powerEntity = EntityPowerupStar;
                  break;
              }
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
              this.items = 0;
              this.active = false;
              this.bounce();
              var pm = ig.game.spawnEntity(this.powerEntity, this.pos.x, this.pos.y-4);
              pm.zIndex = -10;
              ig.game.sortEntitiesDeferred();
            }
          } else if (this.coins > -1) {
            if (this.coins > 0) {
              if (!this.killTimer) {
                this.killTimer = new ig.Timer(5);
              }
              this.active = false;
              this.bounce();
              ig.game.spawnEntity(EntityParticleCoin, this.pos.x+4, this.pos.y-20);
              this.coins--;
              if(this.killTimer.delta() >= 0){
                this.coins = 0;
              }
              if (this.coins === 0) {
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
          } else {
            if (ig.game.super) {
              this.kill();
            } else {
              this.active=false;
              this.bounce();
              entity.bumpSound.play();
            }
          }
        }
      } else if (entity instanceof EntityEnemy) {
        if (axis === 'x' && entity.sliding === true) {
          this.kill();
        }
      }
    },
    kill: function() {
      this.breakSound.play();
      ig.game.spawnEntity(EntityParticleBrick, this.pos.x, this.pos.y);
      this.parent();
    }
  });
});