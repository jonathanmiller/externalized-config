var fs   = require( 'fs' ),
	_    = require( 'underscore' ),
	argv = require( 'optimist' ).argv;


var defaultOptions = {
	env: "{{appname}}_CONFIG",
	dot: "~/.config/{{appname}}.json",
	opt: "--config"
};

var _getUserHome = function () {
  return process.env[ ( process.platform == 'win32' ) ? 'USERPROFILE' : 'HOME' ];
};

var _loadConfig = function( name ) {
	
	// console.log( "processing configuration for " + name );

	var envName  = defaultOptions.env.replace( "{{appname}}", name.toUpperCase() ).replace( "-", "_" ),
	    envValue = process.env[ envName ];

    // console.log( "env -> " + envName + "; " + envValue );

	if ( _.isUndefined( envValue ) || envValue == "undefined" ) {

		var dotValue = defaultOptions.dot.replace( "{{appname}}", name.toLowerCase() ).replace( "~", _getUserHome() ).replace( "-", "_" );
		
		if ( fs.existsSync( dotValue ) ) {
			console.log( "configuration file " + dotValue + " loaded" );
		 	return _parse( dotValue );
		}
		else {
			
			if ( _.isUndefined( argv.config ) ) {
				console.log( "No configuration specified" );
				return false;
			}
			else {

				var argValue = argv.config.replace( "~", _getUserHome() ).replace( "-", "_" );

				if ( fs.existsSync( argValue ) ) {
					console.log( "configuration file " + argValue + " loaded" );
		 			return _parse( argValue );
				}
				else {
					console.log( "configuration file " + envValue + " does not exist" );
					return false;
				}

			}

		}

	}
	else {
		
		envValue = envValue.replace( "~", _getUserHome() );

		if ( fs.existsSync( envValue ) ) {
			console.log( "configuration file " + envValue + " loaded" );
			return _parse( envValue );
		}
		else {
			console.log( "configuration file " + envValue + " does not exist" );
			return false;
		}

	}

};


var _parse = function( file ) {

	var content = fs.readFileSync( file );

	return JSON.parse( content, 'utf8' );

};


module.exports = function() {

	if ( !fs.existsSync( 'package.json' ) ) {
		console.log( "No configuration specified; missing package.json" );
		return false;
	}

	var name = _parse( 'package.json', 'utf8' ).name;

	var config = _loadConfig( name );

	// console.log( "config -> " + config );

	return config;

};
