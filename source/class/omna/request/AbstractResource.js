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

        _signRequest: function (pPath, pData, token, secret) {
            var credentials = omna.request.Session.getCredentials();

            pData = qx.lang.Object.clone(pData) || {};

            // Add token and timestamp to URL parameters.
            Object.assign(pData, { token: token || credentials.token, timestamp: Date.now() });

            // Join the service path and the ordered sequence of characters, excluding the quotes,
            // corresponding to the JSON of the parameters that will be sent.
            var msg = pPath + JSON.stringify(pData).replace(/["']/g, '').split('').sort().join('');

            // Generate the corresponding hmac parameter using the js-sha256 or similar library.
            pData.hmac = sha256.hmac.update(secret || credentials.secret, msg).hex();

            return pData;
        },

        submit: function (pMethod, pPath, pData, pCallBack, pScope, token, secret) {
            // !this.isAsync() && omna.dialog.Waiting.activate();
            omna.dialog.Waiting.activate();

            pPath = this._getServicePath(pPath);

            var request = new omna.request.Xhr(this._getServiceUrl(pPath), pMethod);

            // Set request headers
            request.setRequestHeader("Accept", "application/json");
            if (pMethod.match(/^(POST|PUT)$/)) request.setRequestHeader("Content-Type", "application/json");

            // Set params
            request.resetRequestData();
            request.set({ requestData: this._signRequest(pPath, pData || {}, token, secret), async: this.getAsync() });

            // Listener events
            request.addListener("success", function (e) {
                this.onSuccess(e, pCallBack, pScope);
            }, this);

            request.addListener("statusError", function (e) {
                this.onStatusError(e, pCallBack, pScope);
            }, this);

            request.send();
        },

        find: function (pId, pCallBack, pScope) {
            // Call remote service
            this.submit("GET", pId, null, pCallBack, pScope);
        },

        /**
         * Call REST services to find all record.
         *
         * @param pOrder {String?} Order of results.
         * @param pFilters {Map?} Filter to apply.
         * @param pCallBack {Function} Callback function with response params Ex: function(response){...}.
         * @param pScope {Object?} Callback function scope.
         */
        findAll: function (pOrder, pFilters, pCallBack, pScope) {
            var pData = qx.lang.Object.clone(pFilters) || {};

            if (pOrder) pData.order = pOrder;

            this.submit("GET", null, pData, pCallBack, pScope);
        },

        /**
         * Call REST services to find all record in a given range.
         *
         * @param pStart {Number} Start index of results.
         * @param pEnd {Number} End index of results.
         * @param pOrder {String?} Order of results.
         * @param pFilters {Map?} Filter to apply.
         * @param pCallBack {Function} Callback function with response params Ex: function(response){...}.
         * @param pScope {Object?} Callback function scope.
         */
        findRange: function (pFrom, pTo, pOrder, pFilters, pCallBack, pScope) {
            if (qx.lang.Type.isFunction(pFilters)) {
                pScope = pCallBack;
                pCallBack = pFilters;
                pFilters = null;
            } else if (qx.lang.Type.isFunction(pOrder)) {
                pScope = pFilters;
                pCallBack = pOrder;
                pFilters = null;
                pOrder = null;
            }

            var pData = qx.lang.Object.clone(pFilters) || {};

            pData.offset = pFrom;
            pData.limit = pTo - pFrom + 1;

            if (pOrder) pData.order = pOrder;

            this.submit("GET", null, pData, pCallBack, pScope);
        },

        count: function (pFilters, pCallBack, pScope) {

            var pData = qx.lang.Object.clone(pFilters);

            pData.offset = 0;
            pData.limit = 5;

            // Call remote service
            this.submit("GET", null, pFilters, pCallBack, pScope);
        },

        create: function (pData, pCallBack, pScope) {
            // Call remote service
            this.submit("POST", null, { data: pData }, pCallBack, pScope);
        },

        update: function (pId, pData, pCallBack, pScope) {
            // Call remote service
            this.submit("PUT", pId, { data: pData }, pCallBack, pScope);
        },

        remove: function (pId, pCallBack, pScope) {
            // Call remote service
            this.submit("DELETE", pId, null, pCallBack, pScope);
        },

        /**
         * Fired when request completes without error and transport’s status indicates success.
         */
        onSuccess: function (e, pCallBack, pScope) {
            var response = e.getTarget().getResponse();
            response.statusCode = response.statusCode || e.getTarget().getStatus();
            response.successful = true;
            pCallBack && pCallBack.call(pScope || this, response, e);
        },

        /**
         * Fired when request completes without error but erroneous HTTP status.
         */
        onStatusError: function (e, pCallBack, pScope) {
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

            pCallBack && pCallBack.call(pScope || this, response, e);
            q.messaging.emit("Application", "error", response.message);
        }
    }
});
