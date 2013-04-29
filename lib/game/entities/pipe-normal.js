ig.module(
  'game.entities.pipe-normal'
)
.requires(
  'game.entities.pipe'
)
.defines(function(){

EntityPipeNormal = EntityPipe.extend({

  size: {x:32, y:32},
  offset: {x: 0, y: 0},
  animSheet: new ig.AnimationSheet( 'media/pipes.png', 32, 32 ),

  init: function(x, y, settings) {
    this.parent(x, y, settings);
    this.addAnim( 'pipenormal', 10, [this.eColour] );
    console.log('pipe',this.eColour,this.anims.pipenormal);
    this.currentAnim = this.anims.pipenormal;
    this.currentAnim.flip.x = this.flipX;
    this.currentAnim.flip.y = this.flipY;
  }
});

});