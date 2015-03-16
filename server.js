var express = require( 'express' );
var app = express();

app.use( express.static( __dirname + '/sitemaps' ) );

app.listen( 3000, function () {
    console.log( __dirname + '/sitemaps'  );
} );