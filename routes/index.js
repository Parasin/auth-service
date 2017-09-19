const config = require( '../config' ),
			User   = require( './user' ),
			Auth   = require( './auth' );

let routes = ( app ) => {
	app.use( ( req, res, next ) => {
		res.setHeader( 'Access-Control-Allow-Origin', '*' );
		res.setHeader( 'Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE' );
		res.setHeader( 'Access-Control-Allow-Headers', 'X-Requested-With,content-type' );
		res.setHeader( 'Access-Control-Allow-Credentials', true );
		res.removeHeader( 'X-Powered-By' );
		next();
	} );

	app.use( `${config.appRoot}user`, ( req, res, next ) => {
		return next();
	}, User );

	app.use( `${config.appRoot}auth`, ( req, res, next ) => {
		return next();
	}, Auth );
};

module.exports = routes;
