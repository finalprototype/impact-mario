ig.module( 
	'game.main' 
)
.requires(
	'impact.game',
	'impact.font',
	'impact.sound',
	'impact.util',
  'plugins.tween',
  'plugins.thumbpad',
	
	'game.entities.player',
	'game.entities.block',
	
	'game.levels.onswipecore'
)
.defines(function(){
Mario = ig.Game.extend({
	
	// Load a font
	font: new ig.Font( 'media/04b03.font.png' ),
	gravity:1200,
	stats:{sol:3,soc:0,sos:0,sof:0,soi:false,soil:9},
	lives:3,
	coins:0,
	alive:false,
	player:null,
	super:0,
	fire:0,
	invincible:false,
	invincibleLifetime:10,
	levelType:0,
	isPaused:false,
	isFrozen:false,
	isComplete:false,
	isMuted:false,
	levels: [
			 [LevelOnswipecore,'onswipe',3]
			],
	levelIndex:0,
	gameoverSound: new ig.Sound('media/smb_gameover.ogg',false),
	coinSound: new ig.Sound('media/smb_coin.ogg',false),
	lifeSound: new ig.Sound('media/smb_1_up.ogg'),
	pauseSound: new ig.Sound('media/smb_pause.ogg'),
	clearSound: new ig.Sound('media/smb_stage_clear.ogg'),
	worldClearSound: new ig.Sound('media/smb_world_clear.ogg'),
	onswipeMusic: new ig.Sound('media/brandshift.ogg'),
	invincibleMusic: new ig.Sound('media/starman.ogg'),
	
	
	init: function() {
		ig.input.bind( ig.KEY.RIGHT_ARROW, 'right' );
		ig.input.bind( ig.KEY.LEFT_ARROW, 'left' );
		ig.input.bind( ig.KEY.DOWN_ARROW, 'crouch' );
		ig.input.bind( ig.KEY.X, 'jump' );
		ig.input.bind( ig.KEY.Z, 'sprint' );
		ig.input.bind( ig.KEY.ENTER, 'pause' );
		ig.input.bind( ig.KEY.M, 'mute' );
		//ig.input.bind( ig.KEY.UP_ARROW, 'SUP' );
		//ig.input.bind( ig.KEY.F, 'freeze' );
		//ig.input.bind( ig.KEY.PERIOD, 'volUp' );
		//ig.input.bind( ig.KEY.COMMA, 'volDown' );
		var jpad = this.thumbControl.thumbPad;
		this.thumbControl.setScreenWidth(ig.system.width);
		jpad.setContext(ig.system.context);
		jpad.setColor('black');
		jpad.location = 0;  //0 = LEFT SIDE, 1 = RIGHT SIDE
		this.thumbControl.setUpControls();

		ig.music.add(this.onswipeMusic,'onswipe');
		ig.music.add(this.invincibleMusic,'invincible');
		ig.music.volume = 0.5;
		ig.music.loop = true;
		ig.game.levelType = ig.game.levels[ig.game.levelIndex][2];
		ig.game.loadNextLevel();
	},
	
	ready: function(){
		this.parent();
	},
	
	update: function() {
		// Update all entities and backgroundMaps
		this.parent();
		
		this.player = this.getEntitiesByType( EntityPlayer )[0];
		if( this.player && (this.player.pos.x - ig.system.width/2)>0  && this.player.pos.x<(this.collisionMap.width*this.collisionMap.tilesize)-(ig.system.width/2)) {
						this.screen.x = this.player.pos.x - ig.system.width/2;
		}
		
		this.screen.y = -8-(ig.system.height-this.collisionMap.height*this.collisionMap.tilesize);
		
		//background music
		if(!this.isComplete && this.alive && !this.isPaused){
			if(this.invincible){
				ig.music.play('invincible');
			}else if(this.levelType==0){
				ig.music.play('overworld');
			}else if(this.levelType==1){
				ig.music.play('underworld');
			}else if(this.levelType==3){
				ig.music.play('overworld');
			}else if(this.levelType==4){
				ig.music.play('onswipe');
			}else if(this.levelType=='blank'){
				ig.music.stop();
			}
		}else{
			ig.music.stop();
			var enemies = this.getEntitiesByType( EntityEnemy );
			for(var ei=0;ei<enemies.length;ei++)
			{
				enemies[ei].active = false;
				enemies[ei].vel.x = 0;
				enemies[ei].vel.y = 0;
				enemies[ei].accel.x = 0;
				enemies[ei].accel.y = 0;
			}
		}
		
		if(ig.input.pressed('pause'))
		{
			this.isPaused = !this.isPaused;
			if(this.isPaused)
			{
				this.pauseSound.play();
				ig.music.pause();
				ig.game.freeze(true);
			}else{
				this.pauseSound.play();
				ig.music.play();
				ig.game.defrost();
			}
		}
		
		
		if(ig.input.pressed('freeze'))
		{
			this.isFrozen = !this.isFrozen;
			if(this.isFrozen)
			{
				ig.game.freeze();
			}else{
				ig.game.defrost();
			}
		}
		
		if(ig.input.pressed('mute'))
		{
			if(this.isMuted==0)
			{
				this.isMuted = ig.music.volume;
				ig.music.volume = 0;
			}else{
				ig.music.volume = this.isMuted;
				this.isMuted = 0;
			}
		}
		
		if(ig.input.pressed('volUp'))
		{
				ig.music.volume = ig.music.volume+0.05;
				if(isMuted!=0) this.isMuted = 0;
		}
		
		if(ig.input.pressed('volDown'))
		{
				ig.music.volume = ig.music.volume-0.05;
		}
	},
	
	freeze: function(){
		this.isFrozen = true;
		this.player.active=false;
		var enemies = this.getEntitiesByType( EntityEnemy );
		for(var ei=0;ei<enemies.length;ei++)
		{
			enemies[ei].active = false;
		}
	},
	
	defrost: function(){
		this.isFrozen = false;
		this.player.active=true;
		var enemies = this.getEntitiesByType( EntityEnemy );
		for(var ei=0;ei<enemies.length;ei++)
		{
			enemies[ei].active = true;
		}
	},
	
	draw: function() {
		// Draw all entities and backgroundMaps
		this.parent();
		this.thumbControl.update();
		this.font.draw( 'lives: '+this.stats.sol, ig.system.width-10, 10, ig.Font.ALIGN.RIGHT );
		this.font.draw( 'coins: '+this.coins, 10, 10, ig.Font.ALIGN.LEFT );
		if(this.isPaused)
				this.font.draw('- paused -',ig.system.width/2,ig.system.height/2,ig.Font.ALIGN.CENTER);
	},
	
	addCoin: function(){
		if(ig.game.coins<99){
			this.coinSound.play();
			ig.game.coins++;
		} else {
			ig.game.coins = 0;
			ig.game.addLife();
		}
	},
	
	addLife: function(){
		this.lifeSound.play();
                ig.game.stats.sol++;
	},
	
	respawn: function(){
		ig.game.stats.sol--;
		if(ig.game.stats.sol>0)
		{
			ig.game.loadLevelDeferred( ig.game.levels[ig.game.levelIndex][0] );
		}
		else
		{
			ig.game.gameoverSound.play();
			setTimeout(ig.game.restart,5000)
		}
	},
	
	restart: function(){
		ig.system.setGame(Mario);
	},
	
	loadNextLevel: function(){
		if(this.levelIndex>=ig.game.levels.length){
			ig.game.levelIndex=0;
		}
		ig.game.isComplete=false;
		ig.game.levelType = ig.game.levels[ig.game.levelIndex][2];
		ig.game.loadLevelDeferred(ig.game.levels[ig.game.levelIndex][0]);
	},
	
	levelComplete: function(){
		ig.game.isComplete = true;
		ig.music.stop();
		ig.game.removeEntity(ig.game.player);
		if(this.levelIndex>=ig.game.levels.length-1){
			ig.game.worldClearSound.play();
			setTimeout(ig.game.restart,8000);
		}else{
			ig.game.clearSound.play();
			setTimeout(ig.game.loadNextLevel,7000);
		}
		ig.game.levelIndex++;
	}
});

// Start the Game with 60fps, a resolution of 320x240, scaled
// up by a factor of 2
ig.main( '#canvas', Mario, 30, 600, 280, 2 );
});
