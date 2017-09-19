const User      = require( '../../models/user/' ),
			tokenUtil = require( '../../lib/token.js' ),
      bcrypt    = require( 'bcrypt' );

let express = require( 'express' ),
		router  = express.Router();

//POST
router.post( '/', ( req, res ) => {
	let body = req.body;

	if ( !( body && ( body.userName || body.email ) && body.password ) ) {
		return res.status( 400 ).send( { error: 'Required fields missing; request must include either userName or email, and password' } );
	}

	User.findOne( { $or : [ { email : req.body.email }, { userName: body.userName } ] }, function ( err, user ) {
		if ( err ) {
			return res.status( 500 ).send( 'Problem finding user' );
		}
		if ( !user ) {
			return res.status( 404 ).send( 'No user found.' );
		}

		let passwordIsValid = bcrypt.compareSync( req.body.password, user.password );

		if ( !passwordIsValid ) {
			return res.status( 401 ).send( { auth : false, token : null } );
		}

		let token = tokenUtil.sign( { id : user._id }, 86400 );
		res.status( 200 ).send( { auth : true, token : token } );
	} );
} );

//DELETE
router.delete( '/', tokenUtil.isAuthenticated, ( req, res, next ) => {

} );

module.exports = router;
