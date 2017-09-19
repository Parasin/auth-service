/* TODO Import auth user model and connect to routes */

const config = require( '../config' ),
			User   = require( './User' ),
			Auth   = require( './Auth' );


let routes = ( app ) => {
	// Add headers
	app.use( ( req, res, next ) => {

		// Website you wish to allow to connect
		res.setHeader( 'Access-Control-Allow-Origin', '*' );

		// Request methods you wish to allow
		res.setHeader( 'Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE' );

		// Request headers you wish to allow
		res.setHeader( 'Access-Control-Allow-Headers', 'X-Requested-With,content-type' );

		// Set to true if you need the website to include cookies in the requests sent
		// to the API (e.g. in case you use sessions)
		res.setHeader( 'Access-Control-Allow-Credentials', true );

		// For security reasons we remove this header to prevent exploitation
		res.removeHeader( 'X-Powered-By' );

		// Pass to next layer of middleware
		next();
	} );

	app.use( `${config.appRoot}user`, ( req, res, next ) => {

		/*if ( req.query.token !== token ) {
			return res.status( 403 ).json( {
				message : 'token invalid or missing'
			} );
		}*/
		return next();
	}, User );

	app.use( `${config.appRoot}auth`, ( req, res, next ) => {
		return next();
	}, Auth );
};

module.exports = routes;
