qx.Class.define("omna.request.Connections", {
    extend: omna.request.AbstractResource,

    construct: function () {
        this.base(arguments, 'integrations');
    },

    members: {
        all: function (callBack, scope) {
            var cacheId = 'integration-connected',
                cache = this.getCacheItem(cacheId);

            if (cache) {
                callBack.call(scope, cache);
            } else {
                this.findAll(null, { with_details: true }, function (response) {
                    if (response.successful) this.setCacheItem(cacheId, response);
                    callBack.call(scope, response);
                }, this)
            }
        },

        getChannels: function (callBack, scope) {
            var cacheId = 'integration-channels',
                cache = this.getCacheItem(cacheId);

            if (cache) {
                callBack.call(scope, cache);
            } else {
                // Call remote service
                this.submit("GET", 'channels', null, function (response) {
                    if (response.successful) {
                        this.setCacheItem(cacheId, response);
                    } else {
                        var msg = omna.I18n.trans('Connections', 'Messages', 'FAILED-LOADING-CHANNELS');
                        q.messaging.emit('Application', 'error', msg)
                    }
                    callBack.call(scope, response);
                }, this);
            }
        },

        authorize: function (id) {
            var path = this._getServicePath(id + '/authorize'),
                data = this._signRequest(path, { redirect_uri: this._getAppBaseUrl() }),
                url = this._getServiceUrl(path) + '?' + qx.util.Uri.toParameter(data);

            this.removeCacheItem('integration-connected');
            window.location = url
        },

        unauthorize: function (id, callBack, scope) {
            // Call remote service
            this.submit("DELETE", id + '/authorize', null, function (response) {
                var msg;

                if (response.successful) {
                    msg = omna.I18n.trans('Connections', 'Messages', 'SUCCESSFUL-UNAUTHORIZE');
                    q.messaging.emit('Application', 'good', msg);
                } else {
                    msg = omna.I18n.trans('Connections', 'Messages', 'FAILED-UNAUTHORIZE');
                    q.messaging.emit('Application', 'error', msg)
                }
                callBack && callBack.call(scope, response);
            }, this);
        },

        doImportTask: function (id, type, callBack, scope) {
            // Call remote service
            this.submit("GET", id + '/' + type + '/import', null, function (response) {
                var msg;

                if (response.successful) {
                    msg = omna.I18n.trans('Connections', 'Messages', 'SUCCESSFUL-IMPORT', [type]);
                    q.messaging.emit('Application', 'good', msg);
                } else {
                    msg = omna.I18n.trans('Connections', 'Messages', 'FAILED-IMPORT', [type]);
                    q.messaging.emit('Application', 'error', msg)
                }

                callBack && callBack.call(scope, response);
            }, this);
        },

        cleanCacheItems: function (method, url, response) {
            if (method.match(/POST|PUT|DELETE|PATCH/)) this.removeCacheItem('integration-connected');
        }
    }
});