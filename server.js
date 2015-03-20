var siteDataFile      = './app/data/sitemap-data.js',
    WebSocket         = require( 'ws' )
    , WebSocketServer = WebSocket.Server
    , http            = require( 'http' )
    , express         = require( 'express' )
    , app             = express()
    , bodyParser      = require( 'body-parser' )
    , fs              = require( 'fs' )
    , sites           = require( siteDataFile );

app.use( express.static( __dirname + '/' ) );
app.use( bodyParser.json() );
app.use( bodyParser.urlencoded( {     // to support URL-encoded bodies
    extended: true
} ) );
app.listen( 3000, function () {
} );

// accept POST request on the homepage
app.post( '/map-site', function ( req, res ) {

    crawlSite( req.body );

    res.send( 'Got a Map-Site request' );
} );

// accept POST request on the homepage
app.post( '/remove-mapped-site', function ( req, res ) {

    removeSiteFromSitesCatalog( req.body );

    res.send( 'removed' );
} );

/**
 * Crawler Module
 */
var crawl = require( 'crawl' );
var capture = require( 'capture' );
var buffer = [];

function crawlSite( site ) {

    console.log( site.url );

    addSiteToSitesData( site );

    captureUrl( site.name, [ site.url ] );

    return;

    crawl.crawl( url, function ( err, pages ) {

        console.log( pages );
        if ( err ) {
            console.error( "An error occured", err );
            return;
        }

        var urls = pages.map( function ( urlObj ) {
            return urlObj.url;
        } )
        /*
         .filter(
         function ( url ) {
         return url.indexOf( ".php" ) == url.length - 4;
         }
         );*/

        console.log( urls );

        captureUrl( "http://www.google.com" );

        return;

        captureUrl( urls );
        /*
         capture( urls,
         {
         // out: "./sitemaps/pubmatic-web",
         phantomBin: "/Applications/phantomjs/bin/phantomjs",
         format: "png"
         },
         function () {
         console.log( "DONE" );
         }
         );
         */
        //console.log(JSON.stringify(pages));
    } );
}

/*Screenshot the page*/
function captureUrl( siteName, urls ) {

    console.log(siteName);

    var _urls = urls;

    if ( _urls.length === 0 ) return;

    var url = _urls.shift();

    capture(
        [ url ],
        {
            out: "./sitemaps/"+ siteName +"/",
            phantomBin: "/Applications/phantomjs/bin/phantomjs",
            format: "png"
        },
        function () {

            addToWSBuffer( {
                type: "event",
                event: "process-update",
                remaining: _urls.length,
                msg: url
            } );

            captureUrl( siteName, _urls );
        }
    );

}

/*Web Socket Server*/

var WebSocketServer = require( 'ws' ).Server
    , wss           = new WebSocketServer( { port: 8080 } );


process.on( 'uncaughtException', function ( err ) {
    console.log( err );
} );

var wsBuffer = [];
function addToWSBuffer( o ) {

    wsBuffer.push( o );
}
wss.on( 'connection', function connection( ws ) {

    var _wsBuffer = wsBuffer;
    setInterval(
        function () {

            console.log( _wsBuffer.length );
            if ( _wsBuffer.length > 0 ) {

                var o = wsBuffer.shift();
                ws.send( JSON.stringify(
                        o
                    )
                );
            }

        }, 1000
    );

    addToWSBuffer( {
        type: "event",
        event: "web-socket-ready"
    } );

    updateSitesData();

} );

function getWebSocket() {

    return ws;

}

function updateSitesData() {

    addToWSBuffer( {
        type: "event",
        event: "sites-data-update",
        data: sites
    } );

}

function removeSiteFromSitesCatalog( site ) {

    //remove site from data if it exists
    var _sites = sites.filter( function ( s ) {
        return s.name !== site.name;
    } );

    sites = _sites;

    updateSitesData();

}

function addSiteToSitesData( site ) {

    removeSiteFromSitesCatalog( site );

    sites.push( site );

    var fileContent = "module.exports=" + JSON.stringify( sites );
    fs.writeFile( siteDataFile, fileContent );

    updateSitesData();

}
