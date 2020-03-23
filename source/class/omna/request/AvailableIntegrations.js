qx.Class.define("omna.request.AvailableIntegrations", {
    extend: omna.request.AbstractResource,

    construct: function () {
        this.base(arguments, 'available/integrations');
    },

    members: {
        getI18nCatalog: function () {
            return 'AvailableIntegrations'
        },

        install: function (id, callBack, scope) {
            // Call remote service
            this.submit("PATCH", id, null, function (response) {
                var itemLabel = this.i18nTrans('SINGLE-ITEM-REFERENCE'),
                    msg;

                if (response.successful) {
                    msg = this.i18nTrans('Messages', 'SUCCESSFUL-INSTALLING', [itemLabel]);
                    q.messaging.emit('Application', 'good', msg);
                } else {
                    msg = this.i18nTrans('Messages', 'FAILED-INSTALLING', [itemLabel]);
                    q.messaging.emit('Application', 'error', msg);
                }

                callBack && callBack.call(scope, response);
            }, this);
        },

        // override
        onSuccess: function (e, callBack, scope) {
            qx.module.Storage.removeSessionItem('integration-channels');
            this.base(arguments, e, callBack, scope);
        }
    }
});