//

var host = window.document.location.host.replace( /:.*/, '' );
var ws = new WebSocket( 'ws://' + host + ':8080' );

ws.onmessage = function ( event ) {

    var msg = JSON.parse( event.data );

    var $rootScope = angular.element(document.body).scope();

    switch( msg.type ){
        case 'event':
        case 'process-update':
            $rootScope.$broadcast( 'server-push', msg );
            console.log( "WS:", msg );
            break;
        default:
            console.log( "WS: Unhandled", msg );
    }
};