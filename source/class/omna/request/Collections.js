qx.Class.define("omna.request.Collections", {
    extend: omna.request.AbstractResource,

    construct: function () {
        this.base(arguments, 'collections');
    },

    members: {
        getI18nCatalog: function () {
          return 'Collections'
        },

        install: function (id, callBack, scope) {
            // Call remote service
            this.submit("PATCH", id, null, function (response) {
                var msg;

                if (response.successful) {
                    msg = this.i18nTrans('Messages', 'SUCCESSFUL-INSTALLING');
                    q.messaging.emit('Application', 'good', msg);
                } else {
                    msg = this.i18nTrans('Messages', 'FAILED-INSTALLING');
                    q.messaging.emit('Application', 'error', msg);
                }

                callBack && callBack.call(scope, response);
            }, this);
        },

        uninstall: function (id, callBack, scope) {
            alert('TODO:..')
        }
    }
});