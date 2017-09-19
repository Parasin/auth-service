const mongoose   = require( 'mongoose' ),
			express    = require( 'express' ),
			routes     = require( './routes' ),
			bodyParser = require( 'body-parser' ),
			config     = require( './config' ),
			morgan     = require( 'morgan' ),
			path       = require( 'path' ),
			rfs        = require( 'rotating-file-stream' );

let fs            = require( 'fs' ),
		logDirectory  = path.join( __dirname, 'log' );

mongoose.Promise = global.Promise;

fs.existsSync( logDirectory ) || fs.mkdirSync( logDirectory );

mongoose.connect( config.dbUrl, {
	useMongoClient : true,
	autoReconnect  : true
}, ( err ) => {
	if ( err ) {
		throw err;
	}

	console.log( 'Database connection successful' );

	let app             = express(),
			accessLogStream = rfs( 'access.log', {
				interval : '1d',
				path     : logDirectory
			} );

	app.use( morgan( 'dev', { stream : accessLogStream } ) );

	app.use( bodyParser.urlencoded( {
		extended : false,
		limit    : '20mb'
	} ) );

	app.use( bodyParser.json( { limit : '20mb' } ) );

	routes( app );

	app.listen( config.port, () => {
		console.log( 'Now listening on', config.port );

	} );
} );
