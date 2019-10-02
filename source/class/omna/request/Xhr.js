qx.Class.define("omna.request.Xhr", {
    extend: qx.io.request.Xhr,
    include: [qx.locale.MTranslation],

    construct: function (url, method) {
        this.base(arguments, url, method);
        this.addListener('loadEnd', this.__onLoadEnd, this);
        this.addListener('error', this.__onError, this);
    },

    members: {
        send: function () {
            q.messaging.emit('Application', 'loading-start');
            this.base(arguments)
        },

        /**
         * Fired when request completes with or without error.
         */
        __onLoadEnd: function (e) {
            q.messaging.emit('Application', 'loading-release');
            this.dispose()
        },

        /**
         * Fired when request completes with error.
         */
        __onError: function (e) {
            q.messaging.emit("Application", "error", omna.I18n.trans('Messages', 'FAILED-REQUEST'));
        }
    }
});
