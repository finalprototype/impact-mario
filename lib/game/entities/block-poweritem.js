ig.module(
  'game.entities.block-poweritem'
)
.requires(
  'plugins.tween',
  'game.entities.block',
  'game.entities.powerup-mushroom',
  'game.entities.powerup-life',
  'game.entities.powerup-flower',
  'game.entities.powerup-star',
  'game.entities.powerup-poison'
)
.defines(function(){

EntityBlockPoweritem = EntityBlock.extend({

  item: 1,
  power: 'grow',
  powerEntity: undefined,
  direction: 'random',

  init: function(x,y,settings) {
    this.parent(x,y,settings);
    this.currentAnim = this.anims.questionOn;
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
      if (entity.pos.y > this.pos.y) {
        if (this.item > 0) {
          switch(this.power) {
            case 'life':
              this.powerEntity = EntityPowerupLife;
              break;
            case 'grow':
              this.powerEntity = (ig.game.super === 0) ? EntityPowerupMushroom : EntityPowerupFlower;
              break;
            case 'star':
              this.powerEntity = EntityPowerupStar;
              break;
            case 'poison':
              this.powerEntity = EntityPowerupPoison;
              break;
          }
          this.active = false;
          this.bounce();
          var pm = ig.game.spawnEntity( this.powerEntity, this.pos.x, this.pos.y-4 );
              pm.zIndex = -10;
          ig.game.sortEntitiesDeferred();
          this.currentAnim = this.anims.questionOff;
          this.item--;
        }else{
          entity.bumpSound.play();
        }
      }
    }
  }
});

});