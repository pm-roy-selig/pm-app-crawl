/*
* Web Socket Service Manager
*
* */








var wsm =
(function(){

    var WebSocketServer = require( 'ws' ).Server
        , wss           = new WebSocketServer( { port: 8080 } );



    wss.on( 'connection', function connection( ws ) {

        var _wsBuffer = wsBuffer;
        setInterval(
            function () {

                console.log( _wsBuffer.length );
                if ( _wsBuffer.length > 0 ) {

                    var o = wsBuffer.shift();
                    ws.send( JSON.stringify(
                            o
                        )
                    );
                }

            }, 1000
        );

        addToWSBuffer( {
            type: "event",
            event: "web-socket-ready"
        } );



    } );

    var wsBuffer = [];

    function addToWSBuffer( o ) {
        wsBuffer.push( o );
    }



    return{

        addToWSBuffer: addToWSBuffer,
        send: addToWSBuffer


    }
})();

module.exports = wsm;