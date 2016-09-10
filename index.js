var http = require('http');
var express = require('express');
var bodyParser = require('body-parser');
var flybase = require('flybase');
var path = require('path');

var cors = require('cors');
var compression = require('compression');
var serveStatic = require('serve-static');

var app = express();
app.set('view engine', 'ejs');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({	extended: true	}));
app.use(express.static( path.join(__dirname, 'public')));
 
var port = process.env.PORT || 5000; // set our port

var flybaseRef = flybase.init('YOUR-FLYBASE-APP-NAME', "calltracking", 'YOUR-FLYBASE-API-KEY');

//	backend

app.post('/call', function(req, res) {
	flybaseRef.push({
		time: Date.now()/1000,
		number: req.body.To,
		city: req.body.FromCity
	}).then( function( rec ){
		res.type('text/xml');
		res.render('twiml', { message: 'Your call has been recorded!' })
	}, function(err){
		res.type('text/xml');
		console.log(error);
		res.render('twiml', { message: 'Sorry, an error happened.' });
	});
});


app.get('/twiml', function(req, res) {
	res.type('text/xml');
	res.render('twiml', { message: 'Sorry, an error happened.' });
});

// frontend

function setCustomCacheControl(res, path) {
	if (serveStatic.mime.lookup(path) === 'text/html') {
		// Custom Cache-Control for HTML files
		res.setHeader('Cache-Control', 'public, max-age=0')
	}
}

app.use(compression());

app.use(serveStatic(__dirname + '/dashboard', { 
	maxAge: '1d', 
	setHeaders: setCustomCacheControl,
	'index': ['index.html'],
	fallthrough: true
}));


var server = http.createServer(app);
server.listen(process.env.PORT || 3000, function() {
	console.log('Express server started.');
});