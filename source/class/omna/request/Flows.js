qx.Class.define("omna.request.Flows", {
    extend: omna.request.AbstractResource,

    construct: function () {
        this.base(arguments, 'flows');
    },

    members: {
        getTypes: function (callBack, scope) {
            var cacheId = 'flow-types',
                cache = this.getCacheItem(cacheId);

            if (cache) {
                callBack.call(scope, cache);
            } else {
                // Call remote service
                this.submit("GET", 'types', null, function (response) {
                    if (response.successful) {
                        this.setCacheItem(cacheId, response);
                    } else {
                        var msg = omna.I18n.trans('Flows', 'Messages', 'FAILED-LOADING-FLOW-TYPES');
                        q.messaging.emit('Application', 'error', msg)
                    }
                    callBack.call(scope, response);
                }, this);
            }
        },

        toggleSchedule: function (id, callBack, scope) {
            // Call remote service
            this.submit("POST", id + '/toggle/scheduler/status', null, function (response) {
                var msg, scheduler;

                if (response.successful) {
                    scheduler = response.data.task.scheduler;
                    msg = omna.I18n.trans('Flows', 'Messages', 'SUCCESSFUL-SCHEDULER-' + scheduler.active ? 'ON' : 'OFF');
                    q.messaging.emit('Application', 'good', msg);
                } else {
                    msg = omna.I18n.trans('Flows', 'Messages', 'FAILED-TOGGLE-SCHEDULER-STATUS');
                    q.messaging.emit('Application', 'error', msg)
                }
                callBack && callBack.call(scope, response);
            }, this);
        },

        start: function (id, callBack, scope) {
            // Call start service
            this.submit("GET", id + '/start', null, function (response) {
                var msg;

                if (response.successful) {
                    msg = omna.I18n.trans('Flows', 'Messages', 'SUCCESSFUL-START');
                    q.messaging.emit('Application', 'good', msg);
                } else {
                    msg = omna.I18n.trans('Flows', 'Messages', 'FAILED-START');
                    q.messaging.emit('Application', 'error', msg)
                }
                callBack && callBack.call(scope, response);
            }, this);
        }
    }
});
