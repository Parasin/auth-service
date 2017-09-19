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
		type : String
	},

	lastName : {
		type : String
	},

	age : {
		type     : Number,
		required : true
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

userSchema.pre( 'save', function ( next ) {
	this.password = bcrypt.hashSync( this.password, 8 );
	next();
} );


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
