
/**
 * Module dependencies.
 */
var express = require('express')
	, routes = require('./routes')
	, http = require('http');


var app = express.createServer();

app.configure('development',function(){
	app.set('views', __dirname + '/views');
	app.set('view engine', 'jade');
	app.use(express.bodyParser());
	app.use(express.methodOverride());
	app.use(app.router);
	app.use(express.static(__dirname + '/public'));
	app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
});

app.configure('development', function(){
	app.use(express.errorHandler());
});

//app.use(express.bodyParser());

app.get('/', routes.index);

app.get('/simplify', function(req, res){
	res.render('index', { title: 'HTML Simplifier for SFU ENGAGE' });
	});

app.post('/simplify', routes.simplify);

//app.post('/render', routes.render);



app.listen(8888, function(){
	console.log("Server started listening on port %d, in %s mode", app.address().port, app.settings.env);
});

