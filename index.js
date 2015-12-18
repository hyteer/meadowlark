var express = require('express')

var app = express();

//set up handlebars view engine
var exphbs = require('express-handlebars');
var handlebars = exphbs.create({
	defaultLayout: 'main',
	extname: '.hbs',
	helpers: {
		foo: function() {return 'Foo!';},
		bar: function() {return 'Bar!';}
	}
});
app.engine('.hbs', handlebars.engine);
app.set('view engine', '.hbs');

app.set('port', process.env.PORT || 3000);

//Routes for Home and About pages
app.get('/', function(req, res){
	res.render('home');
});
app.get('/about', function(req, res){
	res.render('about')
});

app.get('/about/yt', function(req, res){
	res.type('text/plain');
	res.send('About YT...');
});


//custom 404 page
app.use(function(req, res){
	res.status(404);
	res.render('404');
});

//custom 500 page
app.use(function(req, res){
	console.error(err.stack);
	res.status(500);
	res.render(500);
});

app.listen(app.get('port'), function(){
   console.log('Express started on http://localhost: ' + 
	app.get('port') + '; press ctrl+C to terminate.');
});
