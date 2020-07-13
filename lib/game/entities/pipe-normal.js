ig.module('game.entities.pipe-normal')
.requires('game.entities.pipe')
.defines(function() {
  EntityPipeNormal = EntityPipe.extend({
    size: {x:32, y:32},
    offset: {x: 0, y: 0},
    animSheet: new ig.AnimationSheet('media/sprites/pipes.png', 32, 32),
    init: function(x, y, settings) {
      this.parent(x, y, settings);
      this.addAnim('pipe0', 10, [0]);
      this.addAnim('pipe1', 10, [1]);
      this.addAnim('pipe2', 10, [2]);
      this.addAnim('pipe3', 10, [3]);
      this.currentAnim = this.anims['pipe' + this.pipeColour];
      this.currentAnim.flip.x = this.flipX;
      this.currentAnim.flip.y = this.flipY;
    }
  });
});