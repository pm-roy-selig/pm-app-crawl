var crawl = require( 'crawl' );
var capture = require( 'capture' );


/*
var sm = require('sitemap');

var sitemap = sm.createSitemap ({
        hostname: 'http:/www.pubmatic.com',
        cacheTime: 600000,        // 600 sec - cache purge period

    });


console.log(sitemap.toString());




return;
*/


crawl.crawl( "http://www.pubmatic.com", function ( err, pages ) {
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
        { out: "./pubmatic-web",
            format:"pdf" },
        function(){
            console.log("DONE");
        }
    );
    //console.log(JSON.stringify(pages));
} );