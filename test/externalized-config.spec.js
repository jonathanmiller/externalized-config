var _      = require( "underscore" ),
    fs     = require( "fs" ),
    expect = require( "chai" ).expect,
    module = require( "../externalized-config" ),
    home   = process.env[ ( process.platform == 'win32' ) ? 'USERPROFILE' : 'HOME' ];

describe( "externalized-config module tests", function() {

  it( "should expose the module's API", function() {

    var config = config = module();

    expect( _.isFunction(  module ) ).to.be.true;
    expect( _.isUndefined( config ) ).to.be.false;

  });


  it( "should be able to load configuration from an ENV variable", function() {

    var fileName = "./test/externalized-config.json",
        testData = {
          "beep": "boop"
        };

    after(function() {
      fs.unlink( fileName );
    });

    process.env[ "EXTERNALIZED_CONFIG_CONFIG" ] = fileName;

    fs.writeFileSync( fileName, JSON.stringify( testData ) );

    var config = module();

    expect( config.beep ).to.equal( "boop" );

  });


  it( "should be able to load configuration from a dot location", function() {

    var fileName = home + "/.config/externalized_config.json",
        testData = {
          "aaa": "bbbb"
        };

    after(function() {
      fs.unlink( fileName );
    });

    fs.writeFileSync( fileName, JSON.stringify( testData ) );
  	
    process.env[ "EXTERNALIZED_CONFIG_CONFIG" ] = undefined;

    var config = module();

  	expect( config.aaa ).to.equal( 'bbbb' );

  });

});
