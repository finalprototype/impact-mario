ig.module(
  'game.entities.enemy-goomba'
)
.requires(
  'game.entities.enemy'
)
.defines(function(){

EntityEnemyGoomba = EntityEnemy.extend({

  direction: 'left',
  speed: 35,
  eColour: 0,

  animSheet: new ig.AnimationSheet( 'media/enemy-goomba.png', 16, 16 ),

  init: function( x, y, settings ) {
    this.parent( x, y, settings );
    this.eColour = ig.game.levelType;
    this.addAnim( 'idle', 1, [0+(this.eColour*3)] );
    this.addAnim( 'walk', 0.1, [0+(this.eColour*3),1+(this.eColour*3)] );
    this.addAnim( 'stomp', 1, [2+(this.eColour*3)] );
    switch(this.direction) {
      case 'left':
        this.flip = false;
        this.currentAnim = this.anims.walk;
        break;
      case 'right':
        this.flip = true;
        this.currentAnim = this.anims.walk;
        break;
      case 'stay':
        this.speed=0;
        this.currentAnim = this.anims.idle;
        break;
      case 'none':
        this.speed=0;
        this.currentAnim = this.anims.idle;
        break;
    }
  },

  ready: function() {
    this.parent();
  },

  update: function() {
    if (this.health > 0) {
      this.parent();
    }
  },

  collideWith: function(entity,axis) {
    this.parent(entity,axis);
    if(this.active && !this.killTimer) {
      if(entity instanceof EntityPlayer) {
        if(ig.game.invincible) {
          this.superKill();
        } else if (axis === 'y' && entity.pos.y < this.pos.y) {
          this.currentAnim = this.anims.stomp;
          this.stompSound.play();
          this.killTimer = new ig.Timer(0.2);
          this.maxVel.x = 0;
          this.maxVel.y = 0;
          this.collides = 0;
          this.speed = 0;
          entity.bounce('low');
        } else {
          if (entity.health > 1) {
            entity.getSmall();
          } else {
            entity.kill();
          }
        }
      }
    }
  },

  kill: function() {
    this.parent();
  },

  stomp: function() {
    this.currentAnim = this.anims.stomp;
    this.stompSound.play();
    this.stompTimer.set(0.4);
  }
});

});