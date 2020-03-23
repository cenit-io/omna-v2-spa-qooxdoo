qx.Class.define("omna.request.Connections", {
    extend: omna.request.AbstractResource,

    construct: function () {
        this.base(arguments, 'integrations');
    },

    members: {
        getChannels: function (callBack, scope) {
            var cacheId = 'integration-channels',
                cache = qx.module.Storage.getSessionItem(cacheId);

            if (cache) {
                callBack.call(scope, cache);
            } else {
                // Call remote service
                this.submit("GET", 'channels', null, function (response) {
                    if (response.successful) {
                        qx.module.Storage.setSessionItem(cacheId, response);
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
        }
    }
});