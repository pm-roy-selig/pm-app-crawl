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

        captureUrl( site.name, [ site.url ] );

    }

    function crawlSite2( site, startCallback, progressCallback, endCallback ) {

        log( site.url );

        //addSiteToSitesData( site );

        if ( callbacks.start )
            callbacks.start.call( site );

        crawl.crawl( site.url, function ( err, pages ) {


            if ( err ) {
                console.error( "An error occured", err );
                return;
            }

            console.log( pages );

            callbacks.end.call( pages );

        } );

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
            [ url ],
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

        run: crawlSite2,
        callbacks: callbacks

    };

})();

module.exports = crawler;