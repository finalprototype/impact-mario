module.exports = function (grunt) {
  "use strict";

  // source folders
  var srcFolder = 'lib/game/';
  var entityFolder = srcFolder + 'entities/';
  var levelsFolder = srcFolder + 'levels/';
  var screensFolder = srcFolder + 'screens/';

  // system folders
  var systemFolder = 'lib/impact/';
  var pluginsFolder = 'lib/plugins';

  // dist folders
  var releaseFolder = 'release/';
  var jsReleaseFolder = releaseFolder + 'js/';
  var mediaReleaseFolder = releaseFolder + 'media/';

  // tmp stuff
  var tmpFolder = releaseFolder + 'tmp/';
  var tmpFile = tmpFolder + 'js/mario.js';

  // files
  var releaseFile = releaseFolder + 'js/mario.js';
  var releaseMinFile = releaseFolder + 'js/mario.min.js';
  var jsHintFile = '.jshint';

  var version = require('./package.json').version;

  var lintFiles =  [
    entityFolder + 'block-brick.js',
    entityFolder + 'block-poweritem.js',
    entityFolder + 'block-question-coin.js',
    entityFolder + 'block-unbreakable.js',
    entityFolder + 'block.js',
    entityFolder + 'coin.js',
    entityFolder + 'emptyspace.js',
    entityFolder + 'enemy-beetle.js',
    entityFolder + 'enemy-fireball.js',
    entityFolder + 'enemy-goomba.js',
    entityFolder + 'enemy-koopa.js',
    entityFolder + 'enemy-pirana.js',
    entityFolder + 'enemy.js',
    entityFolder + 'particle-brick.js',
    entityFolder + 'particle-coin.js',
    entityFolder + 'particle.js',
    entityFolder + 'pipe-end.js',
    entityFolder + 'pipe-extend.js',
    entityFolder + 'pipe-normal.js',
    entityFolder + 'pipe.js',
    entityFolder + 'platform-spawner.js',
    entityFolder + 'platform.js',
    entityFolder + 'player.js',
    entityFolder + 'powerup-flower.js',
    entityFolder + 'powerup-life.js',
    entityFolder + 'powerup-mushroom.js',
    entityFolder + 'powerup-poison.js',
    entityFolder + 'powerup-star.js',
    entityFolder + 'powerup.js',
    entityFolder + 'trigger-end.js',
    entityFolder + 'trigger-warp.js',
    srcFolder + 'main.js'
  ];

  // Game Files
  var baseFiles = [
    // game entities
    entityFolder + 'block-brick.js',
    entityFolder + 'block-poweritem.js',
    entityFolder + 'block-question-coin.js',
    entityFolder + 'block-unbreakable.js',
    entityFolder + 'block.js',
    entityFolder + 'coin.js',
    entityFolder + 'emptyspace.js',
    entityFolder + 'enemy-beetle.js',
    entityFolder + 'enemy-fireball.js',
    entityFolder + 'enemy-goomba.js',
    entityFolder + 'enemy-koopa.js',
    entityFolder + 'enemy-pirana.js',
    entityFolder + 'enemy.js',
    entityFolder + 'particle-brick.js',
    entityFolder + 'particle-coin.js',
    entityFolder + 'particle.js',
    entityFolder + 'pipe-end.js',
    entityFolder + 'pipe-extend.js',
    entityFolder + 'pipe-normal.js',
    entityFolder + 'pipe.js',
    entityFolder + 'platform-spawner.js',
    entityFolder + 'platform.js',
    entityFolder + 'player.js',
    entityFolder + 'powerup-flower.js',
    entityFolder + 'powerup-life.js',
    entityFolder + 'powerup-mushroom.js',
    entityFolder + 'powerup-poison.js',
    entityFolder + 'powerup-star.js',
    entityFolder + 'powerup.js',
    entityFolder + 'trigger-end.js',
    entityFolder + 'trigger-warp.js',

    // levels
    levelsFolder + 'onswipecore.js',

    // main game file
    srcFolder + 'main.js'
  ];

  // Impact Files
  var vendorFiles = [
    systemFolder + 'animation.js',
    systemFolder + 'background-map.js',
    systemFolder + 'collision-map.js',
    systemFolder + 'debug',
    systemFolder + 'entity.js',
    systemFolder + 'font.js',
    systemFolder + 'game.js',
    systemFolder + 'image.js',
    systemFolder + 'impact.js',
    systemFolder + 'input.js',
    systemFolder + 'loader.js',
    systemFolder + 'map.js',
    systemFolder + 'sound.js',
    systemFolder + 'system.js',
    systemFolder + 'timer.js',
    systemFolder + 'util.js',
    pluginsFolder + 'dynscale.js',
    pluginsFolder + 'thumbpad.js',
    pluginsFolder + 'tween.js'
  ];

  // utility functions
  var util = {
    die: function die () {
      process.exit(0);
      return;
    },
    userInput: function userInput (response) {
      process.stdin.resume();
      process.stdin.setEncoding('utf8');
      process.stdin.on('data', response);
    }
  };

  // grunt configuration
  grunt.initConfig({

    // lint
    jshint: {
      options: {
        jshintrc: jsHintFile
      },
      files: {
        src: lintFiles
      }
    },

    // clean
    clean: {
      release: releaseFolder,
      tmp: tmpFolder
    },

    concat: {
      dev: {
        src: [baseFiles],
        dest: tmpFile
      },
      release: {
        src: [vendorFiles, tmpFile],
        dest: releaseFile
      }
    },

    // replace
    replace: {
      release: {
        options: {
          variables: {
            version: version
          }
        },
        files: [
          {src: tmpFile, dest: tmpFile}
        ]
      }
    },

    // copy images to dist folder
    copy: {
      media: {
        files: [
          {expand: true, cwd: mediaReleaseFolder, src: '**', dest: mediaReleaseFolder}
        ]
      }
    },

    uglify: {
      options: {
        report: false
      },
      prod: {
        files: [
          {src: releaseFile, dest: releaseMinFile}
        ]
      }
    }

  });

  var checkIsMaster = function (callback) {
    var exec = require('child_process').exec;
    var commandOpts = {
      cwd: __dirname
    };
    exec('git branch', commandOpts, function (err, stdOut, stdErr) {
      var out = String(stdOut);
      var isOnMaster = out.indexOf('* master') >= 0;
      if (!isOnMaster) {
        console.error(('Cannot deploy on a branch other than master!').red);
        util.die();
      }
      callback();
    });
  };

  var checkIsClean = function (callback) {
    var exec = require('child_process').exec;
    var commandOpts = {
      cwd: __dirname
    };
    exec('git status', commandOpts, function (err, stdOut, stdErr) {
      var out = String(stdOut);
      var isClean = out.indexOf('nothing to commit') >= 0;
      if (!isClean) {
        console.error(('Cannot deploy unless you have a clean working directory!').red);
        util.die();
      }
      callback();
    });
  };

  var checkIsTagged = function (callback) {
    var expectedTag = 'v' + version;
    var exec = require('child_process').exec;
    exec('git tag', function (err, stdOut, stdErr) {
      var out = String(stdOut);
      var tagExists = out.indexOf(expectedTag) >= 0;
      if (!tagExists) {
        console.error(('Please tag this version before deploying!').red);
        util.die();
      }
      callback();
    });
  };

  grunt.registerTask('check', 'Check the status of this git dir', function () {
    var done = this.async();
    checkIsMaster(function () {
      checkIsClean(function () {
        checkIsTagged(done);
      });
    });
  });

  // Verification task. Asks the user if they are sure they want to deploy
  grunt.registerTask('sure', 'Are you sure?', function () {
    grunt.log.writeln('☠ warning: you better know what you\'re doing ☠'.red);
    grunt.log.write('Please type johhnythemutt\'s breed in lowercase to continue: '.bold.cyan);

    var done = this.async();
    var response = function (chunk) {
      if (chunk === 'mutt\n') {
        grunt.log.writeln('Command acknowledged, here we go...'.bold.green.underline);
        process.stdin.removeListener('data', response);
        done();
      } else {
        grunt.log.writeln('You don\'t know him very well, access denied!'.bold.red.underline);
        util.die();
      }
    };

    util.userInput(response);
  });

  grunt.registerTask('html', function() {
    var ejs = require('ejs');
    var fs = require('fs');
    var done = this.async();

    fs.readFile('./mario.ejs', 'utf8', function (err, data) {
      if (err) {
        throw err;
      }

      var html = ejs.render(data, {
        asset_url: asset_url,
        reader_url: reader_url,
        timestamp: Date.now()
      });

      fs.writeFile(releaseFolder + 'index.html', html, 'utf8', done);

    });
  });

  var colors = require('colors');
  grunt.registerTask('awesome', function() {
    console.log('Mario is Live!'.rainbow);
  });

  // load up the grunt plugins
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-replace');

  // create our tasks
  grunt.registerTask('dev', ['clean', 'jshint', 'concat:dev', 'replace:release', 'concat:release', 'copy:media']);
  grunt.registerTask('prod', ['clean', 'jshint', 'concat:dev', 'replace:release', 'concat:release', 'copy:media', 'uglify:prod']);
  grunt.registerTask('deploy', ['sure', 'check', 'prod', 'html', 'clean:release', 'awesome']);
  grunt.registerTask('default', ['dev']);
};
