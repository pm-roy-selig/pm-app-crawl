(function () {

    var app = angular.module( "app", [] );

    app.service( "mapper", function ( $http ) {

        this.map = function ( siteAttributes ) {

            console.log( "Map:", siteAttributes );

            $http.post( "/map-site", {url:'testing'} ).
            success(function(data, status, headers, config) {
                console.log(data);
            });
        };

        return this;
    } );

    app.controller( "main", ["$scope", "mapper", function ( $scope, mapper ) {

        $scope.params = {
            name: "My Sitemap Name",
            url: "test.com",
            username: "",
            password: ""
        };

        $scope.map = function () {
            mapper.map( $scope.params );
        };

    }] );
})();