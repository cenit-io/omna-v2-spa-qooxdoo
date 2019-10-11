qx.Class.define("omna.request.Xhr", {
    extend: qx.io.request.Xhr,
    include: [qx.locale.MTranslation],

    construct: function (url, method) {
        this.base(arguments, url, method);
        this.addListener('loadEnd', this.__onLoadEnd, this);
        this.addListener('fail', this.__onFail, this);
    },

    members: {
        send: function () {
            q.messaging.emit('Application', 'loading-start');
            try {
                this.base(arguments)
            } catch ( ex ) {
                this.fireEvent("error");
                this.fireEvent("fail");
                this.fireEvent("loadEnd");
            }
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
        __onFail: function (e) {
            q.messaging.emit("Application", "error", omna.I18n.trans('Messages', 'FAILED-REQUEST'));
        }
    }
});
