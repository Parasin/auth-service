const User      = require( '../../models/user/' ),
      tokenUtil = require( '../../lib/token.js' ),
      bcrypt    = require( 'bcrypt' ),
      _         = require( 'underscore' );

let express = require( 'express' ),
    router  = express.Router();

/************************
 * AUTHENTICATED ROUTES *
 ***********************/

//GET
router.get( '/', tokenUtil.isAuthenticated, ( req, res ) => {
  User.findById( req.accessToken._id, ( err, user ) => {
    if ( err ) {
      return res.status( 500 ).send( { error : 'Problem finding user' } );
    } else if ( !user ) {
      return res.status( 404 ).send( { error : 'No user found' } );
    }

    return res.send( user.toJSON() );
  } );
} );

//GET :id
router.get( '/:id', tokenUtil.isAuthenticated, ( req, res ) => {
  User.findById( req.params.id, ( err, user ) => {
    if ( err ) {
      return res.status( 500 ).send( { error : 'Problem finding user' } );
    } else if ( !user ) {
      return res.status( 404 ).send( { error : 'No user found' } );
    }

    return res.send( user.toJSON() );
  } );
} );

//PUT :id
router.put( '/:id', tokenUtil.isAuthenticated, ( req, res ) => {
  if ( !req.body ) {
    return res.status( 400 ).send( {
      error : 'Invalid request; missing user data'
    } );
  }

  User.findById( req.params.id, ( err, user ) => {
    if ( err ) {
      return res.status( 500 ).send( { error : 'Problem finding user' } );
    } else if ( !user ) {
      return res.status( 404 ).send( { error : 'No user found' } );
    }

    if ( req.body.currentPass ) {
      if ( !user.comparePass( req.body.currentPass, user.password ) ) {
        return res.status( 401 ).send( { error : 'Current password is incorrect' } );
      }

      if ( req.body.newPass ) {
        req.body.password = bcrypt.hashSync( req.body.newPass, 8 );
      }
    }

    let body = _.pick( req.body, 'firstName', 'lastName', 'password', 'age', 'gender', 'email', 'primaryPhone' );

    User.update( { _id : req.params.id }, body, ( err, user ) => {
      if ( err ) {
        return res.status( 500 ).send( err );
      } else if ( !user ) {
        return res.status( 404 ).send( { error : 'No user found' } );
      }
      console.log( user );
      return res.send( user );
    } );
  } );
} );

//DELETE :id
router.delete( '/:id', tokenUtil.isAuthenticated, ( req, res ) => {
  User.remove( { _id : req.params.id }, ( err, user ) => {
    if ( err ) {
      return res.status( 500 ).send( { error : 'Problem finding user' } );
    } else if ( !user ) {
      return res.status( 404 ).send( { error : 'No user found' } );
    }

    return res.send( user.toJSON() );
  } );
} );


/***************
 * OPEN ROUTES *
 **************/

//POST
router.post( '/', ( req, res ) => {
  let body = req.body;

  if ( !body ) {
    return res.status( 400 ).send( {
      error : 'Invalid request; missing user data'
    } );
  }

  let user = new User( body );

  user = user.hashPass();

  user.save( ( err, user ) => {
    if ( err ) {
      return res.status( 500 ).send( err );
    } else {
      let token = tokenUtil.sign( user.toJSON(), 86400 );
      return res.status( 201 ).send( { auth : true, token : token } );
    }
  } );
} );

module.exports = router;
