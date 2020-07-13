ig.module('game.entities.block')
.requires('impact.entity')
.defines(function() {
  EntityBlock = ig.Entity.extend({
    size: { x:16, y:16 },
    offset: { x: 0, y: 0 },
    maxVel: { x: 0, y: 0 },
    friction: { x: 1000000, y: 1000000 },
    orig: { x:-1, y:-1 },
    gravityFactor: 0,
    flip: false,
    active: true,
    onscreen: true,
    hidden: false,
    type: ig.Entity.TYPE.A,
    checkAgainst: ig.Entity.TYPE.BOTH,
    collides: ig.Entity.COLLIDES.FIXED,
    animSheet: new ig.AnimationSheet('media/sprites/blocks.png', 16, 16),
    init: function(x, y, settings) {
      this.parent(x, y, settings);
      this.addAnim('brickredtop', 10, [0]);
      this.addAnim('brickbluetop', 10, [1]);
      this.addAnim('brickgraytop', 10, [2]);
      this.addAnim('brickred', 10, [3]);
      this.addAnim('brickblue', 10, [4]);
      this.addAnim('brickgray', 10, [5]);
      this.addAnim('questionbrighton', 0.12, [12,13,14,13,12,12]);
      this.addAnim('questiondarkon', 0.12, [15,16,17,16,15,15]);
      this.addAnim('questionbrightoff', 10, [6]);
      this.addAnim('questiondarkoff', 10, [10]);
      this.addAnim('questiongrayoff', 10, [8]);
      this.addAnim('unbreakablered', 10, [18]);
      this.addAnim('unbreakableblue', 10, [19]);
      this.addAnim('unbreakablegray', 10, [20]);
      this.addAnim('hidden', 10, [22]);
    },
    ready: function() {
      this.parent();
      this.orig.x = this.pos.x;
      this.orig.y = this.pos.y;
      this.active = true;
      if (this.hidden) {
        this.currentAnim = this.anims.hidden;
      }
    },
    update: function() {
      if (ig.game.player && (ig.game.player.pos.x+ig.system.width/1.5>this.pos.x && ig.game.player.pos.x-ig.system.width/1.5<this.pos.x)){
        this.onscreen=true;
      } else {
        this.onscreen=true;
      }
      if (this.onscreen) {
        this.parent();
        if (!this.active){
          this.collides = 0;
        } else{
          this.collides = 8;
        }
      }
    },
    draw: function() {
      if(this.onscreen){
        this.parent();
      }
    },
    handleMovementTrace: function(res) {
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
      var up = this.tween({ pos: { y: this.orig.y-4 } }, 0.06);
      var act = this.tween({ active: true }, 0);
      var down = this.tween({ pos: { y: this.orig.y } }, 0.06);
      up.chain(down);
      down.chain(act);
      up.start();
    },
    collideWith: function(entity, axis) {
      this.parent(entity, axis);
      if (this.active && axis === 'y' && (entity instanceof EntityPlayer)) {
        if (entity.pos.y > this.pos.y) {
          entity.vel.y = entity.vel.y * -1;
          entity.jumping = false;
          this.hidden = false;
        }
      }
    }
  });
});