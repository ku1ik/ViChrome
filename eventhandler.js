vichrome.event = {};

vichrome.event.EventHandler =  function(m, v) {
    // dependencies
    var keyCodes         = vichrome.key.keyCodes,
        KeyManager       = vichrome.key.KeyManager,
        util             = vichrome.util,
        logger           = vichrome.log.logger,

    // private variables
        model = m,
        view = v;

    function onBlur (e) {
        logger.d("onBlur");
        model.blur();
    }

    function onKeyDown (e) {
        logger.d("onKeyDown", e);

        var msg = getHandlableKey( e );
        if( msg ) {
            model.handleKey(msg);
        }
    }

    function onKeyPress (e) {
        logger.d( "onKeyPress", e );
    }

    function onKeyUp (e) {
        logger.d( "onKeyUp", e );

        view.notifyInputUpdated();
    }


    // decide whether to post the key event and do some pre-post process
    // return true if the key event can be posted.
    function getHandlableKey (e) {
        // vichrome doesn't handle meta and alt key for now
        if( e.metaKey || e.altKey ) {
            return undefined;
        }

        if( KeyManager.isOnlyModifier( e.keyIdentifier, e.ctrlKey,
                                       e.shiftKey, e.altKey, e.metaKey ) ) {
            return undefined;
        }

        var code = KeyManager.getLocalKeyCode( e.keyIdentifier, e.ctrlKey,
                                       e.shiftKey, e.altKey, e.metaKey );

        if( model.prePostKeyEvent( code, e.ctrlKey, e.altKey, e.metaKey ) ) {
            return { code : code,
                     ctrl : e.ctrlKey,
                     alt  : e.altKey,
                     meta : e.metaKey };
        }
    }

    function onFocus (e) {
        logger.d("onFocus", e.target.id );
        model.onFocus( e.target );
    }

    function onSettings (msg) {
        model.onSettings( msg );
    }

    function addWindowListeners() {
        window.addEventListener("keydown"    , onKeyDown    , true);
        window.addEventListener("keypress"   , onKeyPress   , true);
        window.addEventListener("keyup"      , onKeyUp      , true);
        window.addEventListener("focus"      , onFocus      , true);
        window.addEventListener("blur"       , onBlur       , true);
    }

    function init() {
        addWindowListeners();
        chrome.extension.sendRequest( { command : "Settings",
                                        type    : "get",
                                        name    : "all" },
                                        onSettings );
    }

    // public APIs
    this.onEnabled = function() {
        init();
        view.init();
        model.init();
    };
};
