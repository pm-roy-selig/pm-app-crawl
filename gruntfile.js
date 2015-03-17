module.exports = function ( grunt ) {

    grunt.initConfig( {

        crawl: {
            live: {
                options: {
                    baseUrl: "http://www.pubmatic.com",
                    content: true,
                    contentDir: "www/static",
                    depth: 4,
                    viewport280,
                    viewportHeight: 1024,
                    waitDelay: 10000,
                    sitemap: true,
                    sitemapDir: "sitemap/pubmatic",
                    exclude: [ "*.js", "*.css" ]
                }
            }
        }

    } );

    grunt.loadNpmTasks( 'grunt-crawl' );

    grunt.registerTask( 'default', [ 'crawl:live' ] );

};