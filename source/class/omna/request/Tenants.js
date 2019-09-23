qx.Class.define("omna.request.Tenants", {
    extend: omna.request.AbstractResource,

    construct: function () {
        this.base(arguments, 'tenants');
    },

    members: {
        doStartup: function (tenant, callBack, scope) {
            // Call remote service
            this.submit("GET", '/startup', null, function (response) {
                var msg;

                if (response.successful) {
                    msg = omna.I18n.trans('Tenants', 'Messages', 'SUCCESSFUL-STARTUP');
                    q.messaging.emit('Application', 'good', msg)
                } else {
                    msg = omna.I18n.trans('Tenants', 'Messages', 'FAILED-STARTUP');
                    q.messaging.emit('Application', 'error', msg)
                }
                callBack.call(scope, response);
            }, this, tenant.token, tenant.secret);
        }
    }
});
