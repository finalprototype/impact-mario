ig.module(
  'game.main'
)
.requires(
  'impact.game',
  'impact.font',
  'impact.sound',
  'impact.util',
  'plugins.tween',

  'game.entities.player',
  'game.entities.block',

  'game.levels.world11',
  'game.levels.world12',
  'game.levels.worldspecial'
)
.defines(function() {
  Mario = ig.Game.extend({
    font: new ig.Font('media/fonts/04b03.font.png'),
    gravity: 1200,
    stats: {
      sol: 3,
      soc: 0,
      sos: 0,
      sof: 0,
      soi: false,
      soil: 9
    },
    lives: 3,
    coins: 0,
    alive: false,
    player: null,
    super: 0,
    fire: 0,
    invincible: false,
    invincibleLifetime: 10,
    levelType: 'above',
    isPaused: false,
    isFrozen: false,
    isComplete: false,
    isMuted: false,
    levels: [
      [LevelWorld11,'above'],
      [LevelWorld12,'below'],
      [LevelWorldspecial,'special']
    ],
    levelIndex:0,

    gameoverSound: new ig.Sound('media/audio/smb_gameover.ogg',true),
    coinSound: new ig.Sound('media/audio/smb_coin.ogg', true),
    lifeSound: new ig.Sound('media/audio/smb_1_up.ogg', true),
    pauseSound: new ig.Sound('media/audio/smb_pause.ogg', true),
    clearSound: new ig.Sound('media/audio/smb_stage_clear.ogg', true),
    worldClearSound: new ig.Sound('media/music/smb_world_clear.ogg', false),
    overworldMusic: new ig.Sound('media/music/smb_overworld.ogg', false),
    underworldMusic: new ig.Sound('media/music/smb_underground.ogg', false),
    specialMusic: new ig.Sound('media/music/music-thedarkone.ogg', false),
    invincibleMusic: new ig.Sound('media/music/starman.ogg', false),

    init: function() {
      ig.input.bind( ig.KEY.D, 'right' );
      ig.input.bind( ig.KEY.A, 'left' );
      ig.input.bind( ig.KEY.S, 'crouch' );
      ig.input.bind( ig.KEY.RIGHT_ARROW, 'right' );
      ig.input.bind( ig.KEY.LEFT_ARROW, 'left' );
      ig.input.bind( ig.KEY.DOWN_ARROW, 'crouch' );
      ig.input.bind( ig.KEY.SPACE, 'jump' );
      ig.input.bind( ig.KEY.COMMA, 'sprint' );
      ig.input.bind( ig.KEY.X, 'jump' );
      ig.input.bind( ig.KEY.Z, 'sprint' );
      ig.input.bind( ig.KEY.ENTER, 'pause' );
      ig.input.bind( ig.KEY.M, 'mute' );
      ig.music.add(this.overworldMusic,'overworld');
      ig.music.add(this.underworldMusic,'underworld');
      ig.music.add(this.specialMusic,'special');
      ig.music.add(this.invincibleMusic,'invincible');
      ig.music.volume = 0.75;
      ig.music.loop = true;
      ig.game.levelType = ig.game.levels[ig.game.levelIndex][1];
      ig.game.loadNextLevel();
    },

    ready: function() {
      this.parent();
    },

    update: function() {
      this.parent();

      this.player = this.getEntitiesByType(EntityPlayer)[0];
      if (
        this.player &&
        (this.player.pos.x - ig.system.width/2) > 0  &&
        this.player.pos.x < (this.collisionMap.width*this.collisionMap.tilesize)-(ig.system.width/2)
      ) {
        this.screen.x = this.player.pos.x - ig.system.width/2;
      }

      this.screen.y = -8 - (ig.system.height - this.collisionMap.height * this.collisionMap.tilesize);

      //background music
      if (!this.isComplete && this.alive && !this.isPaused) {
        if (this.invincible) {
          ig.music.play('invincible');
        } else if (this.levelType === 'above') {
          ig.music.play('overworld');
        } else if (this.levelType === 'below') {
          ig.music.play('underworld');
        } else if (this.levelType === 'special') {
          ig.music.play('special');
        } else if (this.levelType === 'blank') {
          ig.music.stop();
        }
      } else {
        ig.music.stop();
        var enemies = this.getEntitiesByType( EntityEnemy );
        for (var ei = 0; ei < enemies.length; ei++) {
          enemies[ei].active = false;
          enemies[ei].vel.x = 0;
          enemies[ei].vel.y = 0;
          enemies[ei].accel.x = 0;
          enemies[ei].accel.y = 0;
        }
      }

      if (ig.input.pressed('pause')) {
        this.isPaused = !this.isPaused;
        if (this.isPaused) {
          this.pauseSound.play();
          ig.music.pause();
          ig.game.freeze(true);
        } else {
          this.pauseSound.play();
          ig.music.play();
          ig.game.defrost();
        }
      }

      if (ig.input.pressed('freeze')) {
        this.isFrozen = !this.isFrozen;
        if (this.isFrozen) {
          ig.game.freeze();
        } else {
          ig.game.defrost();
        }
      }
    },

    freeze: function() {
      this.isFrozen = true;
      this.player.active=false;
      var enemies = this.getEntitiesByType( EntityEnemy );
      for (var ei=0; ei<enemies.length; ei++) {
        enemies[ei].active = false;
      }
    },

    defrost: function() {
      this.isFrozen = false;
      this.player.active=true;
      var enemies = this.getEntitiesByType( EntityEnemy );
      for (var ei=0; ei<enemies.length; ei++) {
        enemies[ei].active = true;
      }
    },

    draw: function() {
      this.parent();
      this.font.draw('lives: ' + this.stats.sol, ig.system.width-10, 10, ig.Font.ALIGN.RIGHT );
      this.font.draw('coins: ' + this.coins, 10, 10, ig.Font.ALIGN.LEFT );
      if (this.isPaused) {
        this.font.draw('- paused -', ig.system.width/2, ig.system.height/2, ig.Font.ALIGN.CENTER);
      }
    },

    addCoin: function(){
      if (ig.game.coins < 99) {
        this.coinSound.play();
        ig.game.coins++;
      } else {
        ig.game.coins = 0;
        ig.game.addLife();
      }
    },

    addLife: function() {
      this.lifeSound.play();
      ig.game.stats.sol++;
    },

    respawn: function(){
      ig.game.stats.sol--;
      if (ig.game.stats.sol > 0) {
        ig.game.loadLevelDeferred( ig.game.levels[ig.game.levelIndex][0] );
      } else {
        ig.game.gameoverSound.play();
        setTimeout(ig.system.setGame(GameTitle), 5000);
      }
    },

    restart: function(){
      ig.system.setGame(Mario);
    },

    loadNextLevel: function() {
      if (this.levelIndex >= ig.game.levels.length) {
        ig.game.levelIndex = 0;
      }
      ig.game.isComplete = false;
      ig.game.levelType = ig.game.levels[ig.game.levelIndex][1];
      ig.game.loadLevelDeferred(ig.game.levels[ig.game.levelIndex][0]);
    },

    levelComplete: function() {
      ig.game.isComplete = true;
      ig.music.stop();
      ig.game.removeEntity(ig.game.player);
      if (this.levelIndex >= ig.game.levels.length-1) {
        ig.game.worldClearSound.play();
        setTimeout(ig.game.restart, 8000);
      } else {
        ig.game.clearSound.play();
        setTimeout(ig.game.loadNextLevel, 7000);
      }
      ig.game.levelIndex++;
    }
  });
  GameTitle = ig.Class.extend({
    introTimer: null,
    noise: null,
    startSound: new ig.Sound('media/audio/start.ogg', true),
    titleMusic: new ig.Sound('media/music/anamanaguchi.ogg', false),
    font: new ig.Font('media/fonts/04b03.font.png'),
    soundPlayed: false,
    initialized: false,
    init: function() {
      if (!GameTitle.initialized) {
        ig.input.bind(ig.KEY.ENTER,'enter');
        ig.input.bind(ig.KEY.SPACE,'space');
      }
      ig.music.add(this.titleMusic,'titleMusic');
      ig.music.play('titleMusic');
      this.introTimer = new ig.Timer(1);
    },
    run:function() {
      if (ig.input.pressed('enter') || ig.input.pressed('space')) {
        ig.music.stop();
        this.startSound.play();
        this.introTimer = new ig.Timer(1);
        this.initialized = true;
      }
      var d = this.introTimer.delta();
      if (this.initialized && d > 1) {
        ig.system.setGame(Mario);
      }
      ig.system.clear('#000000');
      if (d > 0 || this.initialized) {
        this.font.draw('"Super Mario Bros"\n'+
          'ImpactJS SDK Tech Demo\n\n'+
          '---\n\n'+
          'A/S/D or Arrow Keys = Left/Right/Crouch\n'+
          'SPACE or X = Jump\n'+
          ', or Z = Sprint\n'+
          'Enter = Start/Pause',ig.system.width/2,50,ig.Font.ALIGN.CENTER);
      }
      if (d > 0 && (d%1 < 0.5 || this.initialized)) {
        this.font.draw('press start',ig.system.width/2,ig.system.height-35,ig.Font.ALIGN.CENTER);
      }
      if(this.initialized & d > -0.5) {
        ig.system.clear('rgba(0, 0, 0, 1)');
      }
    }
  });

  ig.main('#canvas', GameTitle, 30, 400, 240, 2);
});
