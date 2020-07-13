ig.module(
	'game.entities.xxmap'
)
.requires(
	'impact.entity',
	'game.entities.enemy',
	'plugins.tween'
)
.defines(function(){

EntityXxmap = ig.Entity.extend({
	
		size: {x:3376, y:224},
		offset: {x: 0, y: 0},
		maxVel: {x: 0, y: 0},
		friction: {x: 500000, y: 500000},
		speed:0,
		jump:0,
		gravityFactor:0,
		
		type: ig.Entity.TYPE.NONE,
		checkAgainst: ig.Entity.TYPE.NONE,
		collides: ig.Entity.COLLIDES.NEVER,
		animSheet: new ig.AnimationSheet( 'media/map1.png', 3376, 224 ),
	
	init: function( x, y, settings ) {
		this.addAnim( 'idle',1000000,[0]);
		this.currentAnim = this.anims.idle;
		this.currentAnim.alpha = 0.3;
		this.parent( x, y, settings );
	}
});

});