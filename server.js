var express = require('express');
var url = require('url');
var grunt = require('grunt');

var app = module.exports = express();

// Configuration

app.configure(function(){
  app.set('views', __dirname + '/views');
  app.set('view engine', 'ejs');
  app.set("view options", { layout: false });
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(express.static(__dirname + '/release'));
  app.use(app.router);
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
  app.set("port", process.argv[2] || 3013);
});

app.get('/', function(req, res) {

  res.render('mario.ejs', {
    game_url: '/js/mario.min.js',
    timestamp: Date.now()
  });
});

grunt.tasks('dev', {}, function() {
  console.log('grunt is done');
  app.listen(app.get("port"), function(){
    console.log("Express server listening on port " + app.get("port"));
  });
});
