var express = require('express');
var app = express();
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const expressSwagger = require('express-swagger-generator')(app);
const bodyParser = require('body-parser')
var path = require("path");
const { check } = require('./src/middleware/auth');
const { encode, decode } = require('./src/utils/utility');
var auth = require('basic-auth');
const constants = require('./src/config/config_detail');
var userRouter = require('./src/routes/user_route');


app.get('/', (req, res) => {
	res.redirect('/api');
});
app.get('/api', (req, res) => {
	var credentials = auth(req);

	// Check credentials
	if (!credentials || !check(credentials.name, credentials.pass)) {
		res.statusCode = 401;
		res.setHeader('WWW-Authenticate', 'Basic realm="User Basic Credential"');
		res.end('Access denied')
	} else {
		res.send(`<html><script>window.location.href = "${constants.swagger_origin}/api-docs#/"</script></html>`)
	}
});

const options = {
	swaggerDefinition: {
		info: {
			description: 'CURD APIs',
			title: 'Swagger',
			version: '1.0.0',
		},
		host: constants.base_url,
		basePath: '/',
		produces: ['application/json', 'application/xml'],
		schemes: ['http', 'https'],
		securityDefinitions: {
			JWT: {
				type: 'apiKey',
				in: 'header',
				name: 'Authorization',
				description: '',
			},
		},
	},
	basedir: __dirname, // app absolute path
	files: ['./src/routes/**/*.js', './src/controllers/**/*.js'], // Path to the API handle folder
};
expressSwagger(options);


// handle cors origin
app.use(function (req, res, next) {

	// Website you wish to allow to connect
	res.setHeader('Access-Control-Allow-Origin', '*');

	// Request methods you wish to allow
	res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

	// Request headers you wish to allow
	res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type,Authorization');

	// Set to true if you need the website to include cookies in the requests sent
	// to the API (e.g. in case you use sessions)
	res.setHeader('Access-Control-Allow-Credentials', true);

	// Pass to next layer of middleware
	next();
});

// parse requests of content-type - application/json
app.use(bodyParser.json());

// parse requests of content-type - application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));

app.use(cookieParser());


app.use(async (req, res, next) => {
	await encode(req);
	global.origin = req.headers.origin;
	console.log("global origin", global.origin)
	next()
});
app.use(async (req, res, next) => {
	// adding validator middleware
	await decode(req);
	next()
});


app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));



app.use('/user', userRouter);


//holding the error and saving from the crash starts here
process.on("uncaughtException", function (err) {
	console.log(err.stack);
});

module.exports = app 
