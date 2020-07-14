module.exports = function (grunt) {
  "use strict";

  require('dotenv').config();

  var version = require('./package.json').version;
  const DEVELOPMENT = process.env.NODE_ENV === 'development';

  const srcFolder = 'lib/game/';
  const mediaFolder = 'media/';
  const systemFolder = 'lib/impact/';
  const pluginsFolder = 'lib/plugins';

  const releaseFolder = 'release/';
  const jsReleaseFolder = releaseFolder + 'js/';
  const mediaReleaseFolder = releaseFolder + 'media/';
  const releaseFile = releaseFolder + 'js/mario.js';
  const releaseMinFile = releaseFolder + 'js/mario.min.js';

  const s3Folder = 'smb1';
  const asset_url = DEVELOPMENT
    ? 'http://localhost:3013'
    : 'https://dxcrey4r28b1w.cloudfront.net/smb1';
  const game_url = asset_url + (DEVELOPMENT ? '/js/mario.js' : '/js/mario.min.js');

  // utility functions
  const util = {
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


  grunt.initConfig({
    s3: {
      options: {
        key: process.env.AWS_KEY,
        secret: process.env.AWS_SECRET,
        bucket: process.env.AWS_S3_BUCKET,
        access: 'public-read'
      },
      test: {
        upload: [{
          src: releaseFolder + '**',
          dest: s3Folder,
          rel: releaseFolder
        }]
      }
    },

    // lint
    jshint: {
      options: {
        jshintrc: '.jshint'
      },
      files: {
        src: ['lib/game/entities/*.js', 'lib/game/*.js']
      }
    },

    // clean
    clean: {
      release: releaseFolder,
    },

    mkdir: {
      all: {
        options: {
          create: ['release/media', 'release/js']
        },
      },
    },

    'string-replace': {
      dist: {
        files: [{
          expand: true,
          cwd: '.',
          src: releaseFile,
          dest: '.'
        }],
        options: {
          replacements: [{
            pattern: /\(\'media/g,
            replacement: "('" + asset_url + "/media" 
          }]
        }
      }
    },

    // copy images to dist folder
    copy: {
      media: {
        files: [
          {expand: true, src: [mediaFolder+'sprites/*'], dest: releaseFolder},
          {expand: true, src: [mediaFolder+'fonts/*'], dest: releaseFolder},
          {expand: true, src: [mediaFolder+'audio/*'], dest: releaseFolder},
          {expand: true, src: [mediaFolder+'music/*'], dest: releaseFolder}
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
    },
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

  var baking = function (callback) {
    var exec = require('child_process').exec;
    exec('php tools/bake.php lib/impact/impact.js lib/game/main.js release/js/mario.js', function (err, stdOut, stdErr) {
      var out = String(stdOut);
      var baked = out.indexOf('baked') >= 0;
      if(baked){
        console.log('Toasty!');
        callback();
      }
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

    fs.readFile('./views/mario.ejs', 'utf8', function (err, data) {
      if (err) {
        throw err;
      }

      var html = ejs.render(data, {
        game_url: game_url,
        timestamp: Date.now()
      });

      fs.writeFile(releaseFolder + 'index.html', html, 'utf8', done);

    });
  });

  grunt.registerTask('bakery', 'Bake the game file and minify', function() {
    var done = this.async();
    baking(done);
  });

  var colors = require('colors');
  grunt.registerTask('awesome', function() {
    console.log('Mario is Live!'.rainbow);
  });
  grunt.registerTask('tested', function() {
    console.log('Mario test deploy completed!'.rainbow);
    console.log('Please verify release files, then click enter to continue...'.bold.cyan);

    var done = this.async();
    var response = function (chunk) {
      process.stdin.removeListener('data', response);
      done();
    };

    util.userInput(response);
  });

  // load up the grunt plugins
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-mkdir');
  grunt.loadNpmTasks('grunt-s3');
  grunt.loadNpmTasks('grunt-string-replace');
  grunt.loadNpmTasks('grunt-play');

  // create our tasks
  grunt.registerTask('dev', ['clean', 'jshint', 'mkdir', 'copy:media', 'bakery', 'string-replace:dist', 'html']);
  grunt.registerTask('prod', ['dev', 'uglify:prod']);
  grunt.registerTask('cleanup', ['clean:release', 'awesome']);
  grunt.registerTask('deploy', ['sure', 'check', 'prod', 'cleanup']);
  grunt.registerTask('test', ['prod', 'tested', 'cleanup']);
  grunt.registerTask('default', ['prod']);
};
