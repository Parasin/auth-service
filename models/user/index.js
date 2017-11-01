const mongoose = require( 'mongoose' ),
      bcrypt   = require( 'bcrypt' );

let userSchema = mongoose.Schema( {
  userName : {
    type      : String,
    required  : true,
    unique    : true,
    lowercase : true,
    index     : true
  },

  password : {
    type     : String,
    required : true
  },

  email : {
    type      : String,
    required  : true,
    unique    : true,
    lowercase : true,
    index     : true
  },

  firstName : {
    type     : String,
    required : true
  },

  lastName : {
    type     : String,
    required : true
  },

  age : {
    type : Number
  },

  gender : {
    type : String
  },

  primaryPhone : {
    type : String
  },

  lastLogin : {
    type    : Date,
    default : Date.now()
  }
} );

userSchema.methods.hashPass = function () {
  this.password = bcrypt.hashSync( this.password, 8 );
  return this;
};

userSchema.methods.toJSON = function () {
  let obj = this.toObject();
  delete obj.password;
  delete obj.__v;
  return obj;
};

userSchema.methods.comparePass = function ( password ) {
  return bcrypt.compareSync( password, this.password );
};

module.exports = mongoose.model( 'User', userSchema );
