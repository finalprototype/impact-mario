ig.module(
  'game.entities.enemy-beetle'
)
.requires(
  'game.entities.enemy'
)
.defines(function(){

EntityEnemyBeetle = EntityEnemy.extend({

  size: {x:16, y:16},
  offset: {x: 0, y: 1},
  maxVel: {x: 175, y: 250},
  direction: 'left',
  health: 2,
  type: 1,
  speed: 35,
  sliding: false,
  eColour: 0,

  animSheet: new ig.AnimationSheet( 'media/sprites/enemy-beetle.png', 16, 17 ),

  init: function( x, y, settings ) {
    this.parent( x, y, settings );
    if(ig.game.levelType>0) {
      this.eColour = 1;
    }
    this.speed = this.maxVel.x/5;
    this.addAnim( 'idle', 1, [2+(this.eColour*3)] );
    this.addAnim( 'walk', 0.1, [0+(this.eColour*3),1+(this.eColour*3)] );
    switch(this.direction) {
      case 'left':
        this.flip = false;
        this.currentAnim = this.anims.walk;
        break;
      case 'right':
        this.flip = true;
        this.currentAnim = this.anims.walk;
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
    if(this.health>0) {
      this.parent();
      if (this.killTimer && this.killTimer.delta() >= 0) {
        this.kill();
      }
      if (this.reviveTimer && this.reviveTimer.delta() >= 0) {
        this.currentAnim = this.anims.walk;
        this.health=2;
        this.sliding = true;
        this.reviveTimer = null;
        this.speed = this.maxVel.x/5;
      }
      if (ig.game.collisionMap.getTile(this.pos.x+8, this.pos.y + this.size.y+1) &&
          !ig.game.collisionMap.getTile(this.pos.x + (this.flip ? +12 : this.size.x -12), this.pos.y + this.size.y+1) &&
          !this.sliding) {
        this.flip = !this.flip;
      }
    }
  },

  collideWith: function(entity,axis) {
    if (this.active && !this.killTimer) {
      if (entity instanceof EntityPlayer) {

        if (ig.game.invincible) {
          this.superKill();
          return;
        }

        if (axis === 'y' && entity.pos.y < this.pos.y) {
          if(this.health === 2) {
            this.currentAnim = this.anims.idle;
            this.stompSound.play();
            this.reviveTimer = new ig.Timer(7);
            this.speed = 0;
            entity.bounce('low');
            this.receiveDamage(1);
          } else if (this.health === 1) {
            this.currentAnim = this.anims.idle;
            entity.bounce('low');
            if (this.sliding) {
              this.speed = 0;
              this.sliding = false;
              this.reviveTimer = new ig.Timer(7);
              this.stompSound.play();
            } else {
              this.kick(entity);
            }
          }
        } else {
          if (this.health === 1 && !this.sliding) {
            this.kick(entity);
          } else {
            if (entity.health>1) {
              entity.getSmall();
            } else {
              entity.kill();
            }
          }
        }
      } else if (entity instanceof EntityEnemy) {
        if (this.sliding) {
          this.kickSound.play();
          entity.superKill();
        } else {
          this.flip = !this.flip;
        }
      } else if (axis === 'x') {
        this.flip = !this.flip;
        if (this.sliding) {
          this.bumpSound.play();
        }
      }
    }
    return;
  },

  check: function(entity){
    if(entity instanceof EntityBlock) {
      if(this.pos.y+this.size.y < entity.pos.y) {
        console.log('true');
      }
    }
  },

  handleMovementTrace: function(res) {
    if (res.collision.x) {
      if(this.sliding) {
        this.bumpSound.play();
      }
    }
    this.parent(res);
  },

  kick: function(entity) {
    this.flip = entity.pos.x+entity.size.x/2 < this.pos.x+this.size.x/2 ? true : false;
    this.speed = this.maxVel.x;
    this.sliding = true;
    this.reviveTimer = null;
    this.kickSound.play();
  },

  kill: function() {
    this.parent();
  }
});

});