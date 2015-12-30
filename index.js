var express = require('express')
var app = express();
var fortune = require('./lib/fortune.js');

//Add dir 'public' as static resource
app.use(express.static(__dirname + '/public'));

// Disable Express x-powered-by
app.use(function(req, res, next){
	res.removeHeader("X-Powered-By");
	next();
});


//set up handlebars view engine
var exphbs = require('express-handlebars');
var handlebars = exphbs.create({
	defaultLayout: 'main',
	extname: '.hbs',
	helpers: {
		section: function(name, options){
			if(!this._sections) this._sections = {};
			this._sections[name] = options.fn(this);
			return null;
		}
	}
});
app.engine('.hbs', handlebars.engine);
app.set('view engine', '.hbs');


app.set('port', process.env.PORT || 3000);


// mocked weather data
function getWeatherData(){
	return {
		locations: [
			{
				name: 'Portland',
				forecastUrl: 'http://www.wunderground.com/US/OR/Portland.html',
				iconUrl: 'http://icons-ak.wxug.com/i/c/k/cloudy.gif',
				weather: 'Overcast',
				temp: '54.1 F (12.3 C)',
			},
			{
				name: 'Bend',
				forecastUrl: 'http://www.wunderground.com/US/OR/Bend.html',
				iconUrl: 'http://icons-ak.wxug.com/i/c/k/partlycloudy.gif',
				weather: 'Partly Cloudy',
				temp: '55.0 F (12.8 C)',
			},
			{
				name: 'Manzanita',
				forecastUrl: 'http://www.wunderground.com/US/OR/Manzanita.html',
				iconUrl: 'http://icons-ak.wxug.com/i/c/k/rain.gif',
				weather: 'Light Rain',
				temp: '55.0 F (12.8 C)',
			},
		],
	};
}

// middleware to add weather data to context
app.use(function(req, res, next){
	if(!res.locals.partials) res.locals.partials = {};
	res.locals.partials.weatherContext = getWeatherData();
	next();
});


//Routes for Home and About pages
app.get('/', function(req, res){
	res.render('home');
});
app.get('/about', function(req, res){
	res.render('about', { fortune: fortune.getFortune() });
});

app.get('/thank-you', function(req, res){
	res.render('thank-you', { fortune: fortune.getFortune() });
});

//YT test.
app.get('/about/yt', function(req, res){
	res.type('text/plain');
	res.send('About YT...');
});

//Render a plain text for test page
app.get('/test', function(req, res){
	res.type('text/plain');
	res.send('this is a test');
});

//Pages have no layout file
app.get('/nolayout', function(req, res){
	res.render('nolayout', { layout: null });
});

//custom layout
app.get('/customtest',function(req, res){
	res.render('customtest', { layout: 'custom'})
})


// Route handlers for nursery rhyme
app.get('/nursery-rhyme', function(req, res){
	res.render('nursery-rhyme');
});
app.get('/data/nursery-rhyme', function(req, res){
	res.json({
		animal: 'squirrel',
		bodyPart: 'tail',
		adjective: 'bushy',
		noun: 'heck',
	});
});

// Form handling with several apporaches
//app.use(require('body-parser')());
var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: false}));
app.get('/newsletter-ajax', function(req, res){
// we will learn about CSRF later...for now, we just
// provide a dummy value
	res.render('newsletter-ajax', { csrf: 'CSRF token goes here' });
});

/*
app.post('/process', function(req, res){
	console.log('Form (from querystring): ' + req.query.form);
	console.log('CSRF token (from hidden form field): ' + req.body._csrf);
	console.log('Name (from visible form field): ' + req.body.name);
	console.log('Email (from visible form field): ' + req.body.email);
	res.redirect(303, '/thank-you');
});
*/
//Handle form useing AJAX
app.post('/process', function(req, res){
	if(req.xhr || req.accepts('json,html')==='json'){
// if there were an error, we would send { error: 'error description' }
		res.send({ success: true });
	} else {
// if there were an error, we would redirect to an error page
		res.redirect(303, '/thank-you');
	}
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

