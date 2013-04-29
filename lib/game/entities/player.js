ig.module(
	'game.entities.player'
)
.requires(
	'impact.entity',
	'game.entities.enemy',
	'plugins.tween'
)
.defines(function(){

EntityPlayer = ig.Entity.extend({
	
		size: {x:10, y:15},
		offset: {x: 3, y: 17},
		maxVel: {x: 250, y: 500},
		friction: {x: 500, y: -30},
		speed:200,
		jump:500,
		jumping : false,
		jumpcount : 0,
		gravityFactor:1,
		accelGround: 500,
		accelAir: 200,
		animationType:0,
		flip:false,
		active:true,
		growTimer:null,
		recoveryTimer:null,
		crouched:false,
		zIndex:999999,
		
		type: ig.Entity.TYPE.A,
		checkAgainst: ig.Entity.TYPE.BOTH,
		collides: ig.Entity.COLLIDES.SEMI,
		health:1,
        
        
		bumpSound: new ig.Sound('media/smb_bump.ogg',true),
		dieSound: new ig.Sound('media/smb_playerdie.ogg',false),
		jumpSound: new ig.Sound('media/smb_jump_small.ogg',true),
		jumpSuperSound: new ig.Sound('media/smb_jump_super.ogg',true),
		coinSound: new ig.Sound('media/smb_coin.ogg',true),
		growSound: new ig.Sound('media/smb_powerup.ogg',false),
		pipeSound: new ig.Sound('media/smb_pipe.ogg',false),
		animSheet: new ig.AnimationSheet( 'media/mario.png', 16, 32 ),
	
	init: function( x, y, settings ) {
		for(var i=0;i<8;i++)
		{
			var _s = i<=3?0:1;
			this.addAnim( 'idle'+_s+i%4, 1, [i*8] );
			this.addAnim( 'walk'+_s+i%4, 0.09, [1+(i*8),2+(i*8),3+(i*8)] );
			this.addAnim( 'run'+_s+i%4, 0.05, [1+(i*8),2+(i*8),3+(i*8)] );
			this.addAnim( 'skid'+_s+i%4, 1, [4+(i*8)] );
			this.addAnim( 'jump'+_s+i%4, 1, [5+(i*8)] );
			if(_s==1){
				this.addAnim( 'crouch1'+i%4, 1, [6+(i*8)] );
			}
		}
		this.addAnim( 'death', 1, [6] );
		this.addAnim( 'grow1',0.01,[7,0]);
		this.addAnim( 'grow2',0.01,[7,32]);
		
		this.jumpTimer = new ig.Timer();
		this.jumpAttackVel = -50;
		this.jumpSustainVel = -300;
		
		this.parent( x, y, settings );
	},
	
	ready: function(){
		this.parent();
		if(ig.game.super){
			this.health = 2;
			this.offset.y = 2;
			this.size.y = 30;
			this.pos.y = this.pos.y-16;
		}
		ig.game.alive=true;
	},
	
        update: function() {
            if(this.active){
		if(this.health>0 && ig.game.alive){
			if(ig.game.invincible)
			{
				if( this.idleTimer.delta() > ig.game.invincibleLifetime ) {
					ig.game.invincible = false;
					this.collides = ig.Entity.COLLIDES.SEMI;
					this.animationType = ig.game.fire?1:0;
				}else if( this.idleTimer.delta() > ig.game.invincibleLifetime-5 ) {
					this.animationType = this.animationType+0.3333334;
				} else {
					this.animationType++;
				}
				if(this.animationType>=4)
					this.animationType=0;
			}
			
			var currAnimType = Math.floor(this.animationType);
			
			if( !this.standing ) {
				this.currentAnim = this.anims['jump'+ig.game.super+currAnimType];
			} else if( this.vel.x != 0 ) {
				if(ig.input.state('sprint'))
				    this.currentAnim = this.anims['run'+ig.game.super+currAnimType];
				else
				    this.currentAnim = this.anims['walk'+ig.game.super+currAnimType];
				    
				if((ig.input.state('right') && this.vel.x < 0) || (ig.input.state('left') && this.vel.x > 0)) {
				    this.currentAnim = this.anims['skid'+ig.game.super+currAnimType];
				}
			    
			} else {
				this.currentAnim = this.anims['idle'+ig.game.super+currAnimType];
			}
			
			
			if(ig.input.pressed('SUP')){
				if(!ig.game.super)
					this.getBig();
				else
					this.getSmall();
			}
			
			if(ig.game.super){
				if(ig.input.state('crouch')){
					if(!this.crouched){
						this.pos.y = this.pos.y+16;
					}
					this.currentAnim = this.anims['crouch'+ig.game.super+currAnimType];
					this.offset.y = 17;
					this.size.y = 15;
					this.crouched = true;
				} else if(this.crouched){
					this.offset.y = 2;
					this.size.y = 30;
					this.pos.y = this.pos.y-16;
					this.crouched = false;
				}
			}
			
			this.speed = !ig.game.super==0?180:150;
			this.maxVel.x = ig.input.state('sprint') ? this.speed : this.speed/1.5;
			var accel = this.standing ? this.accelGround : this.accelAir;
			if( ig.input.state('left') && (!this.crouched || (this.crouched && this.jumping)) ){
				this.accel.x = ig.input.state('sprint') ? -accel/1.25 : -accel;
				this.flip = true;
			}
			else if( ig.input.state('right') && (!this.crouched || (this.crouched && this.jumping)) ){
				this.accel.x = ig.input.state('sprint') ? accel/1.25 : accel;
				this.flip = false;
			}
			else {
				this.accel.x = 0;
			}
			
				if( ig.input.pressed('jump') && this.standing && !this.jumping) {
						this.jumping=true;
						this.jumpTimer.set(0);
						this.vel.y = this.jumpAttackVel;
						ig.game.super?this.jumpSuperSound.play():this.jumpSound.play();
				 
				} else if ( ig.input.state('jump') && this.jumpTimer.delta() < 0.25 && this.jumping) {
						this.vel.y = this.jumpSustainVel;
				} else {
						this.accel.y = 0;
						this.jumping = false;
				}
			this.currentAnim.flip.x = this.flip;
			if(this.invisTimer){
				var d = this.invisTimer.delta();
				if(d<0){
					this.currentAnim.alpha = this.currentAnim.alpha<1?1:0.3;
				}else{
					this.invisTimer = null;
					this.collides = ig.Entity.COLLIDES.SEMI;
				}
			}else{
				this.currentAnim.alpha = 1;
			}
			
			if(this.pos.y>ig.system.height+32){
				this.health = -99999;
				this.kill();
			}
		}  else {
		    this.currentAnim = this.anims.death;
		    this.vel.x = 0;
		    this.vel.y = 0;
		    this.accel.x = 0;
		    this.accel.y = 0;
		    this.gravityFactor = 0;
		}
		this.parent();
		
	    } else if(ig.game.isFrozen){
		if(this.growTimer){
			var d = this.growTimer.delta();
			if(this.health==2){ //GROW
				if(d>0){
					this.growTimer = null;
					ig.game.defrost();
				}
				if(d>-0.5){
					this.currentAnim = this.anims.grow2;
				}else{
					this.currentAnim = this.anims.grow1;
				}
			} else if(this.health==1){ //SHRINK
				if(d>0){
					this.growTimer = null;
					ig.game.defrost();
					this.recoveryTimer = new ig.Timer(3);
				}
				if(d>-0.5){
					this.currentAnim = this.anims.grow1;
				}else{
					this.currentAnim = this.anims.grow2;
				}
			}
		}
		this.currentAnim.flip.x = this.flip;
		this.currentAnim.update();
	    }
        },
	
	collideWith: function(entity,axis){
		this.parent(entity,axis);
	},
	
	handleMovementTrace: function( res ) {
		this.parent(res);
	},
	
	getInvincibility: function(){
		this.animationType=2;
		this.idleTimer = new ig.Timer();
		this.growSound.play();
		ig.game.invincible = true;
		this.collides = ig.Entity.COLLIDES.SUPER;
	},
	
	getBig: function(){
		ig.game.freeze();
		ig.game.super = 1;
		this.health = 2;
		this.offset.y = 2;
		this.size.y = 30;
		this.pos.y = this.pos.y-16;
		this.growSound.play();
		this.growTimer = new ig.Timer(1);
		this.invisTimer = null;
		this.currentAnim.alpha = 1;
		this.collides = ig.Entity.COLLIDES.SEMI;
		console.log('get bigg');
	},
	
	getSmall: function(){
		ig.game.freeze();
		ig.game.super = 0;
		ig.game.fire = 0;
		this.health = 1;
		this.offset.y = 17;
		this.size.y = 15;
		this.pos.y = this.pos.y+16;
		this.pipeSound.play();
		this.growTimer = new ig.Timer(1);
		this.invisTimer = new ig.Timer(5);
		this.collides = 1;
		this.animationType = 0;
		console.log('get small');
	},
	
	getFire: function(){
		this.growSound.play();
		ig.game.fire = 1;
		this.animationType = 1;
		console.log('get fire');
	},
	
	kill: function(){
		ig.game.alive=false;
		ig.game.invincible=false;
		ig.game.sortEntitiesDeferred();
		this.dieSound.play();
		setTimeout(ig.game.respawn,4000);
		this.type = ig.Entity.TYPE.NONE;
		this.checkAgainst = ig.Entity.TYPE.NONE;
		if(this.health>-1){
			this.collides = ig.Entity.COLLIDES.NEVER;
			var tween1 = this.tween( {pos: {y: this.pos.y-48}}, 0.5,{delay:0.5,easing:ig.Tween.Easing.Quadratic.EaseInOut} );
			var tween2 = this.tween( {pos: {y: ig.system.height+128}}, 1,{easing:ig.Tween.Easing.Quadratic.EaseInOut} );
			tween1.chain(tween2);
			tween1.start();
		}
	},
	
	receiveDamage: function(){
		console.log('receiving');
		if(this.health>1){
			this.getSmall();
		} else {
			this.kill();
		}
	},
	
	bounce: function(height){
		switch(height){
				case 'super':
						this.vel.y = -1000;
						break;
				case 'high':
						this.vel.y = -500;
						break;
				case 'low':
						this.vel.y = -200;
						break;
				default:
						this.vel.y = -200;
						break;
		}
	}
});

});