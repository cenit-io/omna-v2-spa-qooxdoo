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
                let itemLabel = this.i18nTrans('SINGLE-ITEM-REFERENCE'),
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

        getChannels: function (callBack, scope) {
            let cacheId = 'integration-channels',
                cache = this.getCacheItem(cacheId);

            if (cache) {
                callBack.call(scope, cache);
            } else {
                // Call remote service
                this.submit("GET", 'channels', null, function (response) {
                    if (response.successful) {
                        this.setCacheItem(cacheId, response);
                    } else {
                        let msg = omna.I18n.trans('Connections', 'Messages', 'FAILED-LOADING-CHANNELS');
                        q.messaging.emit('Application', 'error', msg)
                    }
                    callBack.call(scope, response);
                }, this);
            }
        },

        cleanCacheItems: function (method, url, response) {
            if (method.match(/POST|PUT|DELETE|PATCH/)) this.removeCacheItem('integration-channels');
        }
    }
});