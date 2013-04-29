ig.module(
	'game.entities.enemy-fireball'
)
.requires(
	'game.entities.enemy',
	'plugins.tween'
)
.defines(function(){

EntityEnemyFireball = EntityEnemy.extend({
	
	size: {x:14,y:16},
	offset: {x:0,y:0},
	maxVel: {x: 0, y: 500},
	friction: {x: 1000000, y: 200},
	speed:200,
	jump:500,
	gravityFactor:-1,
	active:true,
	orig:{x:-1,y:-1},
	pauseMove:false,
	moveTimer:null,
		
	type: ig.Entity.TYPE.B,
	checkAgainst: ig.Entity.TYPE.A,
	collides: ig.Entity.COLLIDES.NEVER,
        
	animSheet: new ig.AnimationSheet( 'media/enemy-fireball.png', 14,16 ),
        
	init: function( x, y, settings ) {
		this.parent( x, y, settings );
		this.addAnim( 'idle', 1, [0] );
		this.currentAnim = this.anims.idle;
	},
        
        ready: function(){
            this.parent();
		this.orig.x = this.pos.x;
		this.orig.y = this.pos.y;
		this.gravityFactor = -1;
		this.friction.y = 10000000;
		this.vel.y = 0;
		this.move();
        },
	
	move: function(){
		this.gravityFactor = 0.65;
		this.friction.y = 200;
		this.vel.y = -this.jump;
	},
        
        update: function() {
		this.parent();
		this.currentAnim.flip.y = this.vel.y>=30?true:false;
		if(this.pos.y>=this.orig.y && !this.moveTimer){
			this.pos.y=this.orig.y;
			this.moveTimer = new ig.Timer(2);
			this.gravityFactor = -1;
			this.friction.y = 10000000;
			this.vel.y = 0;
		}
		if(this.moveTimer){
			this.gravityFactor = -1;
			this.friction.y = 10000000;
			this.vel.y = 0;
			var d = this.moveTimer.delta();
			if(d>=0){
				this.moveTimer=null;
				console.log('fly');
				this.move();
			}
		}
        },
	check: function(entity){
		if(entity instanceof EntityPlayer){
			if(!ig.game.invincible)
				entity.receiveDamage();
		}
	},
	
	kill: function(){
		//can not be killed
	}
});

});