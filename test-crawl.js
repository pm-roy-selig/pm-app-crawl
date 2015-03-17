var crawl = require( 'crawl' );
var capture = require( 'capture' );

//var Sitemap = require('simple-sitemap');
//var sitemap = new Sitemap( "http://www.pubmatic.com", "./dist/pubmatic");


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

    capture( urls,
        { out: "./sitemaps/pubmatic-web",
            format:"png" },
        function(){
            console.log("DONE");
        }
    );
    //console.log(JSON.stringify(pages));
} );