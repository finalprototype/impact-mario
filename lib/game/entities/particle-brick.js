ig.module(
	'game.entities.particle-brick'
)
.requires(
	'impact.entity'
)
.defines(function(){

EntityParticleBrick = ig.Entity.extend({
	
	size: {x: 0, y: 0},
	count: 4,
	brickColor:0,
	offset: {x: 0, y: 0},
	maxVel: {x: 0, y: 0},
	friction: {x: 0, y: 0},
        jump:0,
        gravityFactor:1,
	
	type: ig.Entity.TYPE.NONE,
	checkAgainst: ig.Entity.TYPE.NONE,
	collides: ig.Entity.COLLIDES.NEVER,
	
	
	init: function( x, y, settings ) {
		this.parent( x, y, settings );
			var TL_Settings = {speed:-150,jump:250};
			var TR_Settings = {speed:150,jump:250};
			var BL_Settings = {speed:-100,jump:150};
			var BR_Settings = {speed:100,jump:150};
			ig.game.spawnEntity( BrickPiece, x, y,TL_Settings );
			ig.game.spawnEntity( BrickPiece, x, y,TR_Settings );
			ig.game.spawnEntity( BrickPiece, x, y,BL_Settings );
			ig.game.spawnEntity( BrickPiece, x, y,BR_Settings );
	},
	
	
	triggeredBy: function( entity, trigger ) {
		
	},
	
	
	update: function(){
		
	}
});



/*
The particles to spawn by the EntityDebris. See particle.js for more details.
*/

BrickPiece = ig.Entity.extend({
	size: {x: -3000, y: -3000},
	offset: {x: 0, y: 0},
	maxVel: {x: 200, y: 600},
	friction: {x: 150, y: -30},
        jump:600,
        gravityFactor:1,
	speed:10,
	flip:{x:true,y:false},
	eColour:0,
	
	type: ig.Entity.TYPE.NONE,
	checkAgainst: ig.Entity.TYPE.NONE,
	collides: ig.Entity.COLLIDES.NEVER,
	
	animSheet: new ig.AnimationSheet( 'media/bricks-particles.png', 8, 8 ),
		
	init: function( x, y, settings ) {		
		this.parent( x, y, settings );
		eColour = ig.game.levelType;
		this.addAnim( 'default', 5, [eColour] );
		this.currentAnim = this.anims.default;
		this.vel.x = this.speed;
		this.vel.y = -this.jump;
	},
	
	update: function(){
		this.currentAnim.flip.x = !this.flip.x;
		this.currentAnim.flip.y = !this.flip.y;
		this.parent();
	}
});

});