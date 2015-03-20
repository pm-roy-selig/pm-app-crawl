(function () {

    var app = angular.module( "app", [] );

    app.service( "mapper", function ( $http ) {

        this.map = function ( siteAttributes ) {

            console.log( "Map:", siteAttributes );

            $http.post( "/map-site", siteAttributes ).
                success( function ( data, status, headers, config ) {
                    console.log( data );
                } );
        };

        this.removeMappedSite = function ( siteAttributes ) {

            console.log( "Map:", siteAttributes );

            $http.post( "/remove-mapped-site", siteAttributes ).
                success( function ( data, status, headers, config ) {
                    console.log( data );
                } );
        };

        return this;
    } );

    app.controller( "main", [ "$scope", "mapper", function ( $scope, mapper ) {

        $scope.params = {
            name: "My Sitemap Name",
            url: "http://www.google.com",
            username: "",
            password: ""
        };

        $scope.log = [];
        $scope.sites = [];

        $scope.map = function () {
            $scope.disableUI = true;
            $scope.log = [];
            mapper.map( $scope.params );
        };

        $scope.disableUI = true;
        $scope.$on( "server-push", function ( event, msg ) {

            switch ( msg.event ) {
                case 'web-socket-ready':
                    $scope.disableUI = false;
                    break;
                case 'process-update':
                    $scope.log.push( msg.msg );
                    break;
                case 'process-done':
                    $scope.disableUI = false;
                    break;
                case 'sites-data-update':
                    $scope.sites = msg.data;
                    break;

            }
            $scope.disableUI = false;
            $scope.$apply();
        } );

        $scope.removeSiteFromCatalog = function ( site ) {

            mapper.removeMappedSite( site );
        }

    } ] );
})();