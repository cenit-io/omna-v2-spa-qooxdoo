qx.Class.define("omna.request.Flows", {
    extend: omna.request.AbstractResource,

    construct: function () {
        this.base(arguments, 'flows');
    },

    members: {
        getTypes: function (callBack, scope) {
            var cacheId = 'flow-types',
                cache = qx.module.Storage.getSessionItem(cacheId);

            if (cache) {
                callBack.call(scope, cache);
            } else {
                // Call remote service
                this.submit("GET", 'types', null, function (response) {
                    if (response.successful) {
                        qx.module.Storage.setSessionItem(cacheId, response);
                    } else {
                        var msg = omna.I18n.trans('Integrations', 'Messages', 'FAILED-LOADING-FLOW-TYPES');
                        q.messaging.emit('Application', 'error', msg)
                    }
                    callBack.call(scope, response);
                }, this);
            }
        }
    }
});
