qx.Class.define("omna.request.Connections", {
  extend: omna.request.AbstractResource,

  construct: function () {
    this.base(arguments, 'integrations');
  },

  members: {
    all: function (callBack, scope) {
      let cacheId = 'integrations-connected',
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

    authorize: function (id) {
      let path = this._getServicePath(id + '/authorize'),
        credentials = omna.request.Session.getCredentials(),
        data = this._signRequest('GET', path, { redirect_uri: this._getAppBaseUrl(), token: credentials.token }),
        url = this._getServiceUrl(path) + '?' + qx.util.Uri.toParameter(data);

      this.removeCacheItem('integrations-connected');
      window.location = url
    },

    unauthorize: function (id, callBack, scope) {
      // Call remote service
      this.submit("DELETE", id + '/authorize', null, function (response) {
        let msg;

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
      let path = function (type) {
        switch (type) {
          case 'stock-locations':
            return id + '/stock/locations/import'
          default:
            return id + '/' + type + '/import'
        }
      }

      // Call remote service
      this.submit("GET", path(type), null, function (response) {
        let msg;

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
      if (method.match(/POST|PUT|DELETE|PATCH/)) this.removeCacheItem('integrations-connected');
    }
  }
});