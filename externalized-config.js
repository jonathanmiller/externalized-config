var fs   = require( 'fs' ),
	_    = require( 'underscore' ),
	argv = require( 'optimist' ).argv;


var defaultOptions = {
  local: process.cwd() + "/{{appname}}.json",
	env:   "{{appname}}_CONFIG",
	dot:   "~/.config/{{appname}}.json",
	opt:   "--config"
};

var _getUserHome = function () {
  return process.env[ ( process.platform == 'win32' ) ? 'USERPROFILE' : 'HOME' ];
};

var _loadConfig = function( name ) {

	// console.log( "processing configuration for " + name );

	function replaceAll( str, find, replace ) {
		if ( _.isString( find ) )
			return str.replace( new RegExp( find, 'g' ), replace );
		else if ( _.isArray( find ) ) {
			_.each( find, function( it ) {
				str = str.replace( new RegExp( it[0], 'g' ), it[1] );
			});
		}
		return str;
	}

	var envName  = replaceAll( defaultOptions.env, [ [ "{{appname}}", name.toUpperCase() ], [ "-", "_" ] ] ),
	    envValue = process.env[ envName ];

    // console.log( "env -> " + envName + "; " + envValue );

	if ( _.isUndefined( envValue ) || envValue == "undefined" ) {

		var dotValue = replaceAll( defaultOptions.dot, [ [ "{{appname}}", name.toLowerCase() ], [ "~", _getUserHome() ], [ "-", "_" ] ] );

		if ( fs.existsSync( dotValue ) ) {
			console.log( "configuration file " + dotValue + " loaded" );
		 	return _parse( dotValue );
		}
		else {
			if ( _.isUndefined( argv.config ) ) {
        dotValue = replaceAll( defaultOptions.local, [ [ "{{appname}}", name.toLowerCase() ] ] );  

        if ( fs.existsSync( dotValue ) ) { 
          console.log( "configuration file " + dotValue + " loaded" );
          return _parse( dotValue );
        }  
			}
			else {
				var argValue = replaceAll( argv.config, [ [ "{{appname}}", name.toLowerCase() ], [ "~", _getUserHome() ], [ "-", "_" ] ] );

				if ( fs.existsSync( argValue ) ) {
					console.log( "configuration file " + argValue + " loaded" );
		 			return _parse( argValue );
				}
				else {
          dotValue = replaceAll( defaultOptions.local, [ [ "{{appname}}", name.toLowerCase() ] ] ); 
          if ( fs.existsSync( dotValue ) ) { 
            console.log( "configuration file " + dotValue + " loaded" );
            return _parse( dotValue );
          }   
				}
			}
		}
	}
	else {
		envValue = replaceAll( envValue, "~", _getUserHome() );

		if ( fs.existsSync( envValue ) ) {
			console.log( "configuration file " + envValue + " loaded" );
			return _parse( envValue );
		}
		else {
			console.log( "configuration file " + envValue + " does not exist" );
			return false;
		}
	}

  console.log( "No configuration specified" );
  return false;
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
