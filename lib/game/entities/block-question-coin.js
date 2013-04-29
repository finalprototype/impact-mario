ig.module(
  'game.entities.block-question-coin'
)
.requires(
  'plugins.tween',
  'game.entities.block',
  'game.entities.particle-coin'
)
.defines(function(){

EntityBlockQuestionCoin = EntityBlock.extend({
  coins:1,

  init: function(x,y,settings) {
    this.parent(x,y,settings);
    this.currentAnim = this.anims.questionOn;
  },

  update: function() {
    this.parent();
  },

  collideWith: function(entity,axis) {
    this.parent(entity,axis);
    if(this.active && axis === 'y' && (entity instanceof EntityPlayer)) {
      if(entity.pos.y > this.pos.y) {
        if(this.coins > 0) {
          if(!this.killTimer){
            this.killTimer = new ig.Timer(5);
          }
          this.active = false;
          ig.game.spawnEntity(EntityParticleCoin, this.pos.x+4, this.pos.y-20);
          this.bounce();
          this.coins--;
          if(this.killTimer.delta() >= 0) {
              this.coins=0;
          }
          if(this.coins <= 0) {
            this.currentAnim = this.anims.questionOff;
          }
        }else{
           entity.bumpSound.play();
        }
      }
    }
  }
});

});