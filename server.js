var siteDataFile = './app/data/sitemap-data.js'
//    WebSocket = require( 'ws' )
//    , WebSocketServer = WebSocket.Server
    , http = require( 'http' )
    , express = require( 'express' )
    , app = express()
    , bodyParser = require( 'body-parser' )
    , fs = require( 'fs' )
    , sites = require( siteDataFile );


var webSocketService = require( './app_modules/web-socket-service/index.js' );
var crawler = require( './app_modules/crawler/index.js' );


app.use( express.static( __dirname + '/' ) );
app.use( bodyParser.json() );
app.use( bodyParser.urlencoded( {     // to support URL-encoded bodies
    extended: true
} ) );
app.listen( 3000, function () {
} );






// accept POST request on the homepage
app.post( '/map-site', function ( req, res ) {


    var site = req.body;

    //configure crawler
    crawler.callbacks.start = function( url ){
        console.log( url );
    };

    crawler.callbacks.tick = function( args ){
        webSocketService.send( {
            type: "event",
            event: "mapper-update",
            remaining: 0, //args.remaining,
            msg: "111" //args.msg
        } );

        console.log( args );
    };

    crawler.callbacks.end = function( pages ){
        console.log("crawl done");
        webSocketService.send( {
            type: "event",
            event: "mapper-done",
            remaining: 0, //args.remaining,
            msg: "111" //args.msg
        } );

        webSocketService.send( {
            type: "event",
            event: "mapper-dump",
            data:pages
        } );
        addSiteToSitesData( site );
    };


    crawler.run( site );

    res.send( 'Got a Map-Site request' );
} );

// accept POST request on the homepage
app.post( '/remove-mapped-site', function ( req, res ) {

    removeSiteFromSitesCatalog( req.body );

    res.send( 'removed' );
} );


function updateSitesData() {

    webSocketService.send( {
        type: "event",
        event: "sites-data-update",
        data: sites
    } );

}
updateSitesData();

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
