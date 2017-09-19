const jwt    = require( 'jsonwebtoken' ),
			config = require( '../config' );

const token = {
	verify : function ( token, next ) {
		jwt.verify( token, config.secret, function ( err ) {
			if ( err ) {
				return { auth : false, message : 'Failed to authenticate token.' };
			}
			next();
		} );
	},

	sign : function ( user, expiresIn ) {
		return jwt.sign( user, config.secret, {
			expiresIn : expiresIn
		} );
	},

	isAuthenticated : function ( req, res, next ) {
		let token = req.headers[ 'x-access-token' ];

		jwt.verify( token, config.secret, function ( err, decoded ) {
			if ( err ) {
				return res.status( 500 ).send( { auth : false, message : 'Failed to authenticate token.' } );
			}
			req.accessToken = decoded;
			next();
		} );
	}
};

module.exports = token;
