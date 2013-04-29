ig.module(
    'game.entities.platform'
)
.requires(
    'impact.entity'
)
.defines(function(){

EntityPlatform = ig.Entity.extend({

  size: {x:16, y:8},
  offset: {x: 0, y: 0},
  maxVel: {x: 35, y: 35},
  friction: {x: 0, y: 0},
  orig: {x:-1, y:-1},
  gravityFactor: 0,
  active: true,
  onscreen: true,
  leveltype: 0,
  direction: 'down',
  speed: 35,
  flip: {x:0, y:0},
  length: 8,
  _wmScalable: false,

  animSheet: new ig.AnimationSheet( 'media/platform-long.png', 48, 8 ),

  type: ig.Entity.TYPE.A,
  checkAgainst: ig.Entity.TYPE.A,
  collides: ig.Entity.COLLIDES.FIXED,

  init: function(x,y,settings) {
    this.parent(x,y,settings);
    if (this._wmScalable) {
        this.length = this.size.x;
    }
    this.animSheet = new ig.AnimationSheet( 'media/platform-long.png', this.length, 8 ),
    this.size.x = this.length;
    if (this.direction === 'left' || this.direction === 'right') {
      this.flip.y=0;
      this.flip.x = this.direction === 'right' ? 1 : -1;
    }else{
      this.flip.x=0;
      this.flip.y = this.direction === 'up' ? -1 : 1;
    }
    this.leveltype = ig.game.levelType === 'secret' ? 1 : 0;
    this.addAnim( 'idle', 10000, [this.leveltype] );
    this.currentAnim = this.anims.idle;
  },

  update: function() {
    if(ig.game.player && (ig.game.player.pos.x+ig.system.width/1.45 > this.pos.x && ig.game.player.pos.x-ig.system.width/1.45 < this.pos.x)) {
      this.onscreen=true;
    }
    if(this.onscreen){
      if(this.active === true){
        this.vel.x = this.maxVel.x * this.flip.x;
        this.vel.y = this.maxVel.y * this.flip.y;
        this.parent();
      }else{
        this.vel.x = 0;
        this.vel.y = 0;
      }
    }
    if(this.pos.y > ig.system.height+300 || this.pos.y<-300 || this.pos.x<-300 || this.pos.x > ig.game.collisionMap.width*ig.game.collisionMap.tilesize){
      this.kill();
    }
  },

  collideWith: function(entity,axis) {
    this.parent(entity,axis);
    if(entity.collides === ig.Entity.COLLIDES.FIXED) {
      this.kill();
    }
  },

  handleMovementTrace: function( res ) {
    this.parent(res);
    if(res.collision.slope || res.collision.x || res.collision.y) {
      this.kill();
    }
  },

  check: function(entity) {
    if(entity instanceof EntityPlayer) {
      this.active = true;
    }
  },

  kill: function() {
    this.parent();
  }
});

});