qx.Class.define("omna.request.Tasks", {
    extend: omna.request.AbstractResource,

    construct: function () {
        this.base(arguments, 'tasks');
    },

    members: {
        retry: function (id, callBack, scope) {
            // Call start service
            this.submit("GET", id + '/retry', null, function (response) {
                var msg;

                if (response.successful) {
                    msg = omna.I18n.trans('Flows', 'Messages', 'SUCCESSFUL-RETRY');
                    q.messaging.emit('Application', 'good', msg);
                } else {
                    msg = omna.I18n.trans('Flows', 'Messages', 'FAILED-RETRY');
                    q.messaging.emit('Application', 'error', msg)
                }
                callBack && callBack.call(scope, response);
            }, this);
        }
    }
});
