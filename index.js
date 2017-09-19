const mongoose   = require( 'mongoose' ),
			express    = require( 'express' ),
			routes     = require( './routes' ),
			bodyParser = require( 'body-parser' ),
			config     = require( './config' ),
			morgan     = require( 'morgan' ),
			path       = require( 'path' ),
			rfs        = require( 'rotating-file-stream' );

let fs            = require( 'fs' ),
		logDirectory  = path.join( __dirname, 'log' ),
		passport      = require( 'passport' ),
		LocalStrategy = require( 'passport-local' ).Strategy,
		User          = require( './models/user' );

// const token      = require( 'auth-middleware' )( config.authUrl );
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
				interval : '1d', // rotate daily
				path     : logDirectory
			} );

	app.use( morgan( 'dev', { stream : accessLogStream } ) ); // log every request to the console

	app.use( bodyParser.urlencoded( {
		extended : false,
		limit    : '20mb'
	} ) );

	app.use( bodyParser.json( { limit : '20mb' } ) );

	//app.use( token.validate );

	app.use(passport.initialize());

	passport.use( new LocalStrategy(
			function ( userName, password, done ) {
				User.findOne( { userName : userName }, function ( err, user ) {
					if ( err ) {
						return done( err );
					}
					if ( !user ) {
						return done( null, false, { message : 'Incorrect username.' } );
					}
					if ( !user.validPassword( password ) ) {
						return done( null, false, { message : 'Incorrect password.' } );
					}
					return done( null, user );
				} );
			}
	) );

	routes( app );

	app.listen( config.port, () => {
		console.log( 'Now listening on', config.port );

	} );
} );
