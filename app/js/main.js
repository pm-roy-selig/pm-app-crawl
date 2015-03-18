(function () {

    var app = angular.module( "app", [] );

    app.service( "mapper", function () {

        this.map = function ( name, url, username, password ) {

            console.log( "Map:", name, url, username, password );
        };

        return this;
    } );

    app.controller( "main", [ "$scope", "mapper", function ( $scope, mapper ) {

        $scope.params = {
            name: "My Sitemap Name",
            url: "test.com",
            username: "",
            password: ""
        };

        $scope.map = function () {
            mapper.map( $scope.params.name, $scope.params.url, $scope.params.username, $scope.params.password );
        };

    } ] );
})();