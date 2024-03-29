/**
 * @ignore(sha256.*)
 */
qx.Class.define("omna.request.AbstractResource", {
  type: "abstract",
  extend: qx.core.Object,
  include: [qx.locale.MTranslation],
  include: [omna.mixin.MI18n],

  statics: {
    HttpStatus: function (code) {
      let HTTP_STATUS_CODES = {
        100: "Continue",
        101: "Switching Protocols",
        102: "Processing",
        200: "OK",
        201: "Created",
        202: "Accepted",
        203: "Non-Authoritative Information",
        204: "No Content",
        205: "Reset Content",
        206: "Partial Content",
        207: "Multi-Status",
        208: "Already Reported",
        226: "IM Used",

        300: "Multiple Choices",
        301: "Moved Permanently",
        302: "Found",
        303: "See Other",
        304: "Not Modified",
        305: "Use Proxy",
        306: "Reserved",
        307: "Temporary Redirect",
        308: "Permanent Redirect",

        400: "Bad Request",
        401: "Unauthorized",
        402: "Payment Required",
        403: "Forbidden",
        404: "Not Found",
        405: "Method Not Allowed",
        406: "Not Acceptable",
        407: "Proxy Authentication Required",
        408: "Request Timeout",
        409: "Conflict",
        410: "Gone",
        411: "Length Required",
        412: "Precondition Failed",
        413: "Request Entity Too Large",
        414: "Request-URI Too Long",
        415: "Unsupported Media Type",
        416: "Requested Range Not Satisfiable",
        417: "Expectation Failed",
        422: "Unprocessable Entity",
        423: "Locked",
        424: "Failed Dependency",
        425: "Reserved for WebDAV advanced collections expired proposal",
        426: "Upgrade Required",
        427: "Unassigned",
        428: "Precondition Required",
        429: "Too Many Requests",
        430: "Unassigned",
        431: "Request Header Fields Too Large",
        440: "Invalid user or password",

        500: "Internal Server Error",
        501: "Not Implemented",
        502: "Bad Gateway",
        503: "Service Unavailable",
        504: "Gateway Timeout",
        505: "HTTP Version Not Supported",
        506: "Variant Also Negotiates (Experimental)",
        507: "Insufficient Storage",
        508: "Loop Detected",
        509: "Unassigned",
        510: "Not Extended",
        511: "Network Authentication Required"
      };

      return omna.I18n.trans('HTTP-status', 'Messages', HTTP_STATUS_CODES[code]);
    }
  },

  /**
   * Constructor
   *
   * @param serviceBasePath {String} Service base path.
   * @param sync {Boolean?false} Set synchronous or asynchronous request.
   */
  construct: function (serviceBasePath, sync) {
    this.base(arguments);
    this.set({ serviceBasePath: serviceBasePath, async: !sync, baseParams: {} });
  },

  properties: {
    serviceBasePath: {
      check: 'String'
    },

    async: {
      check: 'Boolean',
      init: true
    },

    i18nCatalog: {
      check: 'String',
      init: 'Common'
    },

    baseParams: {
      check: 'Object'
    }
  },

  members: {
    setCacheItem: function (cacheId, data) {
      qx.module.Storage.setSessionItem(cacheId, data);
    },

    getCacheItem: function (cacheId) {
      return qx.module.Storage.getSessionItem(cacheId);
    },

    removeCacheItem: function (cacheId) {
      qx.module.Storage.removeSessionItem(cacheId);
    },

    _getServiceUrl: function (url) {
      if (!url.match(/^https?:/)) url = this._getServerBaseUrl() + '/' + url;

      return url.replace(/([^:\/])\/{2,}/g, '$1/').replace(/\/$/, '');
    },

    _getServicePath: function (path, data) {
      data = data || {};

      path = String(path || '');

      if (!path.match(/^\//)) path = this.getServiceBasePath() + '/' + path;

      let m, v;
      while (m = path.match(/\{(\w+)\}/)) {
        if ((v = data[m[1]])) {
          path = path.replace(m[0], v);
          delete data[m[1]]
        } else {
          path = path.replace(m[0], m[1]);
          this.error('REQUIRE_PATH_PARAMETER', [m[1]])
        }
      }
      return path.replace(/\/{2,}/g, '').replace(/\/$/g, '');
    },

    _getServerBaseUrl: function () {
      return qx.core.Init.getApplication().getServerBaseUrl();
    },

    _getAppBaseUrl: function () {
      return qx.util.Uri.getAbsolute('').replace(/[\?#].*/, '');
    },

    _signRequest: function (method, path, requestData) {
      let queryString, body, credentials = omna.request.Session.getCredentials();

      requestData = qx.lang.Object.clone(requestData) || {};

      // Add timestamp to requestData.
      requestData.timestamp = Date.now();

      if (method.match(/^(GET|HEAD)$/)) {
        this._fixNullQueryParams(requestData)
        queryString = decodeURIComponent(this._toQueryParams(requestData));
        body = '';
      } else {
        queryString = '';
        body = JSON.stringify(requestData);
      }

      let msg = path + queryString + body

      // Generate the corresponding hmac parameter using the js-sha256 or similar library.
      requestData.hmac = sha256.hmac.update(credentials.secret, msg).hex();

      return requestData;
    },

    _fixNullQueryParams: function (requestData) {
      for (key in requestData) {
        if (qx.lang.Type.isObject(requestData[key])) {
          requestData[key] = this._fixNullQueryParams(requestData[key])
        } else if (requestData[key] === undefined || requestData[key] === null) {
          requestData[key] = ''
        }
      }

      return requestData;
    },

    _toQueryParams: function (requestData) {
      let qs = [],
        add = function (k, v) {
          v = qx.lang.Type.isFunction(v) ? v() : v;
          v = v === null ? '' : v === undefined ? '' : v;
          qs[qs.length] = encodeURIComponent(k) + '=' + encodeURIComponent(v);
        },

        buildParams = function (prefix, obj) {
          let i, len, key;

          if (prefix) {
            if (qx.lang.Type.isArray(obj)) {
              for (i = 0, len = obj.length; i < len; i++) {
                buildParams(
                  prefix + '[' + (qx.lang.Type.isObject(obj[i]) && obj[i] ? i : '') + ']',
                  obj[i]
                );
              }
            } else if (qx.lang.Type.isObject(obj)) {
              for (key in obj) buildParams(prefix + '[' + key + ']', obj[key]);
            } else {
              add(prefix, obj);
            }
          } else if (qx.lang.Type.isArray(obj)) {
            for (i = 0, len = obj.length; i < len; i++) add(obj[i].name, obj[i].value);
          } else {
            for (key in obj) buildParams(key, obj[key]);
          }
          return qs;
        };

      return buildParams('', requestData).join('&');
    },

    submit: function (method, path, requestData, callBack, scope) {
      let rData = {};
      let credentials = omna.request.Session.getCredentials();

      qx.lang.Object.mergeWith(rData, qx.lang.Object.clone(this.getBaseParams(), true));
      qx.lang.Object.mergeWith(rData, qx.lang.Object.clone(requestData, true) || {});

      path = this._getServicePath(path, rData);

      let request = this.__requestManagement = new omna.request.Xhr(this._getServiceUrl(path), method);

      requestData = this._signRequest(method, path, rData);

      request.setAsync(this.getAsync());

      // Set request headers and requestData
      request.setRequestHeader("Accept", "application/json");
      request.setRequestHeader("X-HMac", requestData.hmac);
      request.setRequestHeader("X-Token", credentials.token);
      request.resetRequestData();

      delete requestData.hmac;
      delete requestData.token;

      if (method.match(/^(GET|HEAD)$/)) {
        request.setRequestData(this._toQueryParams(requestData));
      } else {
        request.setRequestHeader("Content-Type", "application/json");
        request.setRequestData(requestData);
      }

      // Listener events
      request.addListener("success", function (e) {
        this.onSuccess(e, callBack, scope);
      }, this);

      request.addListener("statusError", function (e) {
        this.onStatusError(e, callBack, scope);
      }, this);

      request.addListener("error", function (e) {
        this.onError(e, callBack, scope);
      }, this);

      request.send();
    },

    find: function (id, callBack, scope) {
      // Call remote service
      this.submit("GET", id, null, callBack, scope);
    },

    reload: function (item, callBack, scope) {
      this.find(item.id, callBack, scope);
    },

    /**
     * Call REST services to find all record in a given range.
     *
     * @param from {Number} Start index of results.
     * @param to {Number} End index of results.
     * @param sort {Object|String?} Sort of results.
     * @param params {Map?} Filters to apply.
     * @param callBack {Function} Callback function with response params Ex: function(response){...}.
     * @param scope {Object?} Callback function scope.
     */
    findRange: function (from, to, sort, params, callBack, scope) {
      if (qx.lang.Type.isFunction(params)) {
        scope = callBack;
        callBack = params;
        params = null;
      } else if (qx.lang.Type.isFunction(sort)) {
        scope = params;
        callBack = sort;
        params = null;
        sort = null;
      }

      let requestData = qx.lang.Object.clone(params) || {};

      requestData.offset = from;
      requestData.limit = to - from + 1;

      if (sort) requestData.sort = sort;

      this.submit("GET", null, requestData, callBack, scope);
    },

    /**
     * Call REST services to find all record.
     *
     * @param sort {Object|String?} Sort of results.
     * @param params {Map?} Filters to apply.
     * @param callBack {Function} Callback function with response params Ex: function(response){...}.
     * @param scope {Object?} Callback function scope.
     */
    findAll: function (sort, params, callBack, scope) {
      let findBlock = qx.lang.Function.bind(function (from, to, items) {
        this.findRange(from, to, sort, params, function (response) {
          if (response.successful) {
            items = items.concat(response.data);

            let total = items.length;

            if (total < response.pagination.total) {
              findBlock(from + response.pagination.limit, to + response.pagination.limit, items)
            } else {
              response.data = items;
              response.pagination = { offset: 0, limit: total, total: total };
              callBack.call(scope, response)
            }
          } else {
            callBack.call(scope, response)
          }
        }, this)
      }, this);

      findBlock(0, 99, []);
    },

    count: function (params, callBack, scope) {
      let requestData = qx.lang.Object.clone(params);

      requestData.without_data = true;

      // Call remote service
      this.submit("GET", null, requestData, callBack, scope);
    },

    create: function (requestData, callBack, scope, i18nActionName) {
      // Call remote service
      this.submit("POST", null, { data: requestData }, function (response, e) {
        this.processResponse(i18nActionName || 'ADDING', response, e, callBack, scope);
      }, this);
    },

    update: function (id, requestData, callBack, scope, i18nActionName) {
      // Call remote service
      this.submit("POST", id, { data: requestData }, function (response, e) {
        this.processResponse(i18nActionName || 'UPDATING', response, e, callBack, scope);
      }, this);
    },

    remove: function (id, callBack, scope, i18nActionName) {
      // Call remote service
      this.submit("DELETE", id, null, function (response, e) {
        this.processResponse(i18nActionName || 'DELETING', response, e, callBack, scope);
      }, this);
    },

    openTaskDetails: function (task) {
      let module = { id: 'TasksDetails', i18n: 'Tasks' },
        data = { item: task, label: this.i18nTrans('Tasks', 'Labels', 'MODULE-REFERENCE-DETAILS', task) };

      q.messaging.emit('Application', 'open-module', module, data);
    },

    processResponse: function (i18nActionName, response, e, callBack, scope) {
      scope = scope || this;

      let itemLabel = scope.i18nTrans('SINGLE-ITEM-REFERENCE'),
        type = 'good',
        prefix = 'SUCCESSFUL-';

      if (!response.successful) {
        type = 'error';
        prefix = 'FAILED-'
      }

      q.messaging.emit('Application', type, scope.i18nTrans('Messages', prefix + i18nActionName, [itemLabel]));

      callBack && callBack.call(scope, response, e);
    },

    cleanCacheItems: function (method, url, response) {

    },

    /**
     * Fired when request completes without error and transport’s status indicates success.
     */
    onSuccess: function (e, callBack, scope) {
      let target = e.getTarget(),
        response = target.getResponse();

      response.statusCode = response.statusCode || target.getStatus();
      response.successful = true;

      callBack && callBack.call(scope || this, response, e);

      if (response.type === 'task' && qx.lang.Type.isObject(response.data)) this.openTaskDetails(response.data);

      this.cleanCacheItems(target.getMethod(), target.getUrl(), response)
    },

    /**
     * Fired when request completes without error but erroneous HTTP status.
     */
    onStatusError: function (e, callBack, scope) {
      let response = e.getTarget().getResponse();

      if (qx.lang.Type.isString(response)) response = { message: response };

      response.successful = false;
      response.statusCode = response.statusCode || e.getTarget().getStatus();
      response.message = response.message || omna.request.AbstractResource.HttpStatus(response.statusCode);

      if (response.statusCode == 511) q.messaging.emit("Application", "login");

      callBack && callBack.call(scope || this, response, e);
      q.messaging.emit("Application", "error", response.message);
    },

    onError: function (e, callBack, scope) {
      let response = e.getTarget().getResponse() || '';

      if (qx.lang.Type.isString(response)) response = { message: response };

      response.successful = false;
      response.statusCode = response.statusCode || e.getTarget().getStatus();
      response.message = response.message || omna.request.AbstractResource.HttpStatus(response.statusCode) || '';

      callBack && callBack.call(scope || this, response, e);
    }
  },

  destruct: function () {
    let rm = this.__requestManagement;
    if (rm && !(rm.isDisposed() || rm.isDone())) rm.abort();
  }
});
