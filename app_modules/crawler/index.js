/**
 * Created by learningcubed on 3/20/15.
 */



var crawler = (function () {


    /**
     * Crawler Module
     */
    var crawl = require( 'crawl' );
    var capture = require( 'capture' );
    var buffer = [];
    var numTicks = 0;

    var callbacks = {

        start: null,
        tick: null,
        end: null
    };

    function log( msg ) {
        console.log( "CRAWLER:", msg );
    }

    function crawlSite( site, startCallback, progressCallback, endCallback ) {

        log( site.url );


        //addSiteToSitesData( site );

        if ( callbacks.start )
            callbacks.start.call( site );

        captureUrl( site.name, [site.url] );

        return;

        /*

         crawl.crawl( url, function ( err, pages ) {

         console.log( pages );
         if ( err ) {
         console.error( "An error occured", err );
         return;
         }

         var urls = pages.map( function ( urlObj ) {
         return urlObj.url;
         } )

         .filter(
         function ( url ) {
         return url.indexOf( ".php" ) == url.length - 4;
         }
         );

         console.log( urls );

         captureUrl( "http://www.google.com" );

         return;

         captureUrl( urls );

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

         //console.log(JSON.stringify(pages));
         } );

         */
    }

    /*Screenshot the page*/
    function captureUrl( siteName, urls ) {

        console.log( siteName );

        var _urls = urls;

        if ( _urls.length === 0 ) {

            if ( callbacks.end ) {
                callbacks.end.call();
            }
            return;

        }

        var url = _urls.shift();

        capture(
            [url],
            {
                out: "./sitemaps/" + siteName + "/",
                phantomBin: "/Applications/phantomjs/bin/phantomjs",
                format: "png"
            },
            function () {

                if ( callbacks.tick ) {
                    callbacks.tick.call( { msg: url, remaining: _urls.length } );
                }
                /*
                 webSocketService.send( {
                 type: "event",
                 event: "process-update",
                 remaining: _urls.length,
                 msg: url
                 } );
                 */
                captureUrl( siteName, _urls );
            }
        );

    }

    return {

        run: crawlSite,
        callbacks: callbacks

    };

})();

module.exports = crawler;