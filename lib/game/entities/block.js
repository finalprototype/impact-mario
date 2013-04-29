ig.module(
  'game.entities.block'
)
.requires(
  'impact.entity'
)
.defines(function(){

EntityBlock = ig.Entity.extend({

  size: {x: 16, y: 16},
  offset: {x: 0, y: 0},
  maxVel: {x: 0, y: 0},
  friction: {x: 1000000, y: 1000000},
  orig:{x: -1, y: -1},
  gravityFactor: 0,
  flip: false,
  active: true,
  onscreen: true,
  hidden: false,
  eColour: 0,
  type: ig.Entity.TYPE.A,
  checkAgainst: ig.Entity.TYPE.BOTH,
  collides: ig.Entity.COLLIDES.FIXED,
  animSheet: new ig.AnimationSheet( 'media/blocks.png', 16, 16 ),

  init: function( x, y, settings ) {
    this.parent( x, y, settings );
    this.eColour = ig.game.levelType?ig.game.levelType:this.eColour;
    this.addAnim( 'brick', 10, [4+this.eColour] );
    this.addAnim( 'bricktop', 10, [this.eColour] );
    var qbac = (5+this.eColour)*4;
    this.addAnim( 'questionOn', 0.12, [qbac,qbac+1,qbac+2,qbac+1,qbac,qbac] );
    this.addAnim( 'questionOff', 10, [12+this.eColour] );
    this.addAnim( 'unbreakable', 10, [16+this.eColour] );
    this.addAnim( 'hidden', 10, [22] );
  },

  ready: function(){
    this.parent();
    this.orig.x = this.pos.x;
    this.orig.y = this.pos.y;
    this.active = true;
    if (this.hidden) {
      this.currentAnim = this.anims.hidden;
    }
  },

  update: function() {
    if (ig.game.player && (ig.game.player.pos.x+ig.system.width/1.5 > this.pos.x && ig.game.player.pos.x-ig.system.width/1.5 < this.pos.x)) {
      this.onscreen=true;
    } else {
      this.onscreen=true;
    }
    if (this.onscreen) {
      this.parent();
      if (!this.active) {
        this.collides = 0;
      } else {
        this.collides = 8;
      }
    }
  },

  draw: function() {
    if(this.onscreen) {
      this.parent();
    }
  },

  handleMovementTrace: function( res ) {
    if (res.collision.y) {
      console.log(res);
    }
    this.parent(res);
  },

  check: function(entity) {
    this.parent(entity);
  },

  kill: function() {
    this.parent();
  },

  bounce: function() {
    var up = this.tween( {pos: {y: this.orig.y-4}}, 0.06);
    var act = this.tween( {active: true}, 0);
    var down = this.tween( {pos: {y: this.orig.y}}, 0.06);
    up.chain(down);
    down.chain(act);
    up.start();
  },

  collideWith: function(entity,axis) {
    this.parent(entity,axis);
    if(this.active && axis === 'y' && (entity instanceof EntityPlayer)) {
      if(entity.pos.y>this.pos.y) {
        entity.vel.y = entity.vel.y*-1;
        entity.jumping = false;
        this.hidden = false;
      }
    }
  }
});

});