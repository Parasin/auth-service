let configs = {
	dbUrl   : process.env.DBURL || 'mongodb://localhost:27017/auth',
	appRoot : process.env.APPROOT || '/',
	env     : process.env.ENV || 'dev',
	secret  : process.env.SECRET || 'superSecret',
	port    : process.env.PORT || 3000,
	token   : ''
};

module.exports = configs;
