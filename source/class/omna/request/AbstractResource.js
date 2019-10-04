/**
 * @ignore(sha256.*)
 */
qx.Class.define("omna.request.AbstractResource", {
    type: "abstract",
    extend: qx.core.Object,
    include: [qx.locale.MTranslation],

    statics: {
        HttpStatus: function (code) {
            var HTTP_STATUS_CODES = {
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
        this.setServiceBasePath(serviceBasePath);
        this.setAsync(!sync);
    },

    properties: {
        serviceBasePath: {
            check: 'String'
        },

        async: {
            check: 'Boolean',
            init: true
        }
    },

    members: {
        _getServiceUrl: function (url) {
            if (!url.match(/^https?:/)) url = this._getServerBaseUrl() + '/' + url;

            return url.replace(/([^:\/])\/{2,}/g, '$1/').replace(/\/$/, '');
        },

        _getServicePath: function (path) {
            path = path || '';

            if (!path.match(/^\//)) path = this.getServiceBasePath() + '/' + path;

            return path.replace(/\/{2,}/g, '').replace(/\/$/g, '');
        },

        _getServerBaseUrl: function () {
            return qx.core.Init.getApplication().getServerBaseUrl();
        },

        _getAppBaseUrl: function () {
            return qx.util.Uri.getAbsolute('').replace(/[\?#].*/, '');
        },

        _signRequest: function (path, data, token, secret) {
            var credentials = omna.request.Session.getCredentials();

            data = qx.lang.Object.clone(data) || {};

            // Add token and timestamp to URL parameters.
            Object.assign(data, { token: token || credentials.token, timestamp: Date.now() });

            // Join the service path and the ordered sequence of characters, excluding the quotes,
            // corresponding to the JSON of the parameters that will be sent.
            var msg = path + JSON.stringify(data).replace(/["']/g, '').split('').sort().join('');

            // Generate the corresponding hmac parameter using the js-sha256 or similar library.
            data.hmac = sha256.hmac.update(secret || credentials.secret, msg).hex();

            return data;
        },

        submit: function (method, path, data, callBack, scope, token, secret) {
            path = this._getServicePath(path);

            var request = new omna.request.Xhr(this._getServiceUrl(path), method);

            // Set request headers
            request.setRequestHeader("Accept", "application/json");
            if (method.match(/^(POST|PUT)$/)) request.setRequestHeader("Content-Type", "application/json");

            // Set params
            request.resetRequestData();
            request.set({ requestData: this._signRequest(path, data || {}, token, secret), async: this.getAsync() });

            // Listener events
            request.addListener("success", function (e) {
                this.onSuccess(e, callBack, scope);
            }, this);

            request.addListener("statusError", function (e) {
                this.onStatusError(e, callBack, scope);
            }, this);

            request.send();
        },

        find: function (id, callBack, scope) {
            // Call remote service
            this.submit("GET", id, null, callBack, scope);
        },

        /**
         * Call REST services to find all record.
         *
         * @param order {String?} Order of results.
         * @param params {Map?} Filters to apply.
         * @param callBack {Function} Callback function with response params Ex: function(response){...}.
         * @param scope {Object?} Callback function scope.
         */
        findAll: function (order, params, callBack, scope) {
            var data = qx.lang.Object.clone(params) || {};

            if (order) data.order = order;

            this.submit("GET", null, data, callBack, scope);
        },

        /**
         * Call REST services to find all record in a given range.
         *
         * @param from {Number} Start index of results.
         * @param to {Number} End index of results.
         * @param order {String?} Order of results.
         * @param params {Map?} Filters to apply.
         * @param callBack {Function} Callback function with response params Ex: function(response){...}.
         * @param scope {Object?} Callback function scope.
         */
        findRange: function (from, to, order, params, callBack, scope) {
            if (qx.lang.Type.isFunction(params)) {
                scope = callBack;
                callBack = params;
                params = null;
            } else if (qx.lang.Type.isFunction(order)) {
                scope = params;
                callBack = order;
                params = null;
                order = null;
            }

            var data = qx.lang.Object.clone(params) || {};

            data.offset = from;
            data.limit = to - from + 1;

            if (order) data.order = order;

            this.submit("GET", null, data, callBack, scope);
        },

        count: function (params, callBack, scope) {
            var data = qx.lang.Object.clone(params);

            data.without_data = true;

            // Call remote service
            this.submit("GET", null, data, callBack, scope);
        },

        create: function (data, callBack, scope) {
            // Call remote service
            this.submit("POST", null, { data: data }, callBack, scope);
        },

        update: function (id, data, callBack, scope) {
            // Call remote service
            this.submit("POST", id, { data: data }, callBack, scope);
        },

        remove: function (id, callBack, scope) {
            // Call remote service
            this.submit("DELETE", id, null, callBack, scope);
        },

        /**
         * Fired when request completes without error and transport’s status indicates success.
         */
        onSuccess: function (e, callBack, scope) {
            var response = e.getTarget().getResponse();
            response.statusCode = response.statusCode || e.getTarget().getStatus();
            response.successful = true;
            callBack && callBack.call(scope || this, response, e);
        },

        /**
         * Fired when request completes without error but erroneous HTTP status.
         */
        onStatusError: function (e, callBack, scope) {
            var response = e.getTarget().getResponse();

            if (qx.lang.Type.isString(response)) {
                response = { message: response }
            }

            response.statusCode = response.statusCode || e.getTarget().getStatus();
            response.successful = false;
            response.message = response.message || omna.request.AbstractResource.HttpStatus(response.statusCode);

            if (response.statusCode == 511) {
                q.messaging.emit("Application", "login");
            }

            callBack && callBack.call(scope || this, response, e);
            q.messaging.emit("Application", "error", response.message);
        }
    }
});
