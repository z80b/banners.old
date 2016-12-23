;(function(W, D, B, undefined){
    'use strict';

    // Console shim
    ;(function(c){
        var e = {},
            n = function(){},
            props = ['memory'],
            mthds = ['assert','clear','count','debug','dir','dirxml','error','exception','group','groupCollapsed','groupEnd','info','log','markTimeline','profile','profiles','profileEnd','show','table','time','timeEnd','timeline','timelineEnd','timeStamp','trace','warn'],
            p, m;
        while( p = props.pop() ){c[p]=c[p]||e};
        while( m = mthds.pop() ){c[m]=c[m]||n};
    })(W.console = W.console || {});

    var LMDA = W.LMDA || {};

    LMDA.$window   = $(W);
    LMDA.$html     = $('html');
    LMDA.$document = $(D);
    LMDA.$body     = $(B);

    LMDA.Views       = {};
    LMDA.Models      = {};
    LMDA.Collections = {};
    LMDA.Templates   = { Controls: {} };
    LMDA.Mixins      = {};
    LMDA.exports     = {}; // Iframe callbacks

    LMDA.page         = null; // Current page view
    LMDA.isTouch      = ('ontouchstart' in W) || (W.DocumentTouch && D instanceof W.DocumentTouch);
    LMDA.isWidescreen = LMDA.$html.hasClass('widescreen');
    LMDA.isOldbrowser = LMDA.$html.hasClass('ie8');
    LMDA.Events       = _.extend({}, Backbone.Events, {
        APP_INIT      : 'app:init',
        APP_READY     : 'app:ready',
        STAT_READY    : 'Statistics:ready',
        SCREEN_CHANGE : 'screenChange',
        PAGE_STATE    : 'pageState',
        CLOSE_TOOLTIPS: 'closeTooltips',
        OPEN_AUTH_FORM: 'auth:open',
        AUTH_SUCCESS  : 'auth:success',
        CART_ADD      : 'cart:add',
        CART_UPDATE   : 'cart:update',
        WISH_LIST_ADD : 'wishlist:add',
        WISH_LIST_REMOVE: 'wishlist:remove'
    });

    LMDA.site        = LMDA['country']['site'];
    LMDA.sizeSystem  = 'RUS';

    if (LMDA.isTouch) {
        //    click event not working on iPad
        //    iPad has a different behavior for non-anchor elements click event
        //    The solution is either adding onclick="" attribute to that element or "cursor:pointer" css property.
        $('body').css('cursor','pointer');
    }

    /**
     * @TODO Remove completely
     * @param {Object} params
     */
    LMDA.ajax = $.ajax;

    LMDA.console = {};

    LMDA.console.error = function(error, message){
        if( error && typeof error === 'object' && error.message ){
            (new Image).src = '//err.lamoda.ru/js/catch?msg=' + error.message;
            if( window.console && typeof window.console.error === 'function' ){
                window.console.error.apply(window.console, arguments);
            };
        }
    };

    // Prepare APP parts
    LMDA.start = function(){
        LMDA.Events.trigger(LMDA.Events.APP_INIT);
        LMDA.page = new LMDA.Views.PageView;

        // Init Statistics
        function loadHandler() {
            LMDA.marketing = new LMDA.Marketing();
            LMDA.Stats && LMDA.Stats.init();
            LMDA.Statistics && LMDA.Statistics.init();
            LMDA.Events.trigger(LMDA.Events.APP_READY);
        }
        if(window.addEventListener){
            window.addEventListener('load', loadHandler);
        } else {
            window.attachEvent('onload', loadHandler);
        }
    };

    if( require && require['config'] ){
        require.config({
            baseUrl: LMDA.country.staticRoot + LMDA.country.requireBaseUrl,
            paths: {
                text: LMDA.country.staticRoot + 'src/js/libs/require/modules/require.text'
            }
        });
    };

    W.LMDA = LMDA;
})(window, document, document.body || document.getElementsByTagName('body')[0]);
