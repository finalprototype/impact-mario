ig.module(
	'game.entities.particle-coin'
)
.requires(
	'impact.entity'
)
.defines(function(){

EntityParticleCoin = ig.Entity.extend({
	size: {x: 8, y: 14},
	offset: {x: 0, y: 0},
	maxVel: {x: 200, y: 600},
	friction: {x: 600, y: -30},
        jump:600,
        gravityFactor:1.5,
	
	type: ig.Entity.TYPE.NONE,
	checkAgainst: ig.Entity.TYPE.NONE,
	collides: ig.Entity.COLLIDES.NEVER,
	
	lifetime: 0.65,
	bounciness: 0,
	
	animSheet: new ig.AnimationSheet( 'media/coin_particle.png', 8, 14 ),
	
	init: function( x, y, settings ) {
		this.parent( x, y, settings );
		this.jump = this.maxVel.y;
		this.addAnim( 'coinflip', 0.05, [0,1,2,3] );
		this.currentAnim = this.anims.coinflip;
		this.idleTimer = new ig.Timer();
                this.vel.y = -this.jump;
		ig.game.addCoin();
	},
	
	ready: function(){
	},
	
	update: function() {
		if( this.idleTimer.delta() > this.lifetime ) {
			this.kill();
			return;
		}
		this.parent();
	}
});


});