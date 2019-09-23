qx.Class.define("omna.request.Tenants", {
    extend: omna.request.AbstractResource,

    construct: function () {
        this.base(arguments, 'tenants');
    },

    members: {
        doStartup: function (id, type, callBack, scope) {
            // Call remote service
            this.submit("GET", '/startup', null, function (response) {
                if (response.successful) {
                    callBack.call(scope, response);
                } else {
                    var msg = omna.I18n.trans('Orders', 'Messages', 'FAILED-INTEGRATION-CHANNELS');
                    q.messaging.emit('Application', 'error', msg)
                }
            }, this);
        }
    }
});
