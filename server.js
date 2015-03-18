var WebSocketServer = require( 'ws' ).Server
    , http = require( 'http' )
    , express = require( 'express' )
    , app = express()
    , bodyParser = require('body-parser');

app.use( express.static( __dirname + '/' ) );
app.use( bodyParser.json() );
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
    extended: true
}));
app.listen( 3000, function () {
} );


// accept POST request on the homepage
app.post('/map-site', function (req, res) {


    crawlSite( req.body.url );



    res.send('Got a Map-Site request');
});



var wss = new WebSocketServer( { port:8080 } );
wss.on( 'connection', function ( ws ) {
    var id = setInterval( function () {
        ws.send( JSON.stringify( process.memoryUsage() ), function () { /* ignore errors */
        } );
    }, 1000 );
    console.log( 'started client interval' );
    ws.on( 'close', function () {
        console.log( 'stopping client interval' );
        clearInterval( id );
    } );
} );


/**
 * Crawler Module
 */
var crawl = require( 'crawl' );
var capture = require( 'capture' );



function crawlSite( url ){

    crawl.crawl( url, function ( err, pages ) {
        if ( err ) {
            console.error( "An error occured", err );
            return;
        }

        var urls = pages.map( function ( urlObj ) {
            return urlObj.url;
        } ).filter(
            function ( url ) {
                return url.indexOf( ".php" ) == url.length - 4;
            }
        );


        console.log( urls );

        capture( urls,
            { out: "./sitemaps/pubmatic-web",
                phantomBin:"/Applications/phantomjs/bin/phantomjs",
                format:"png" },
            function(){
                console.log("DONE");
            }
        );
        //console.log(JSON.stringify(pages));
    } );
}
