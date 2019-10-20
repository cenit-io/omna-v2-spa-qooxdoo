qx.Class.define("omna.management.flow.Details", {
    extend: omna.management.task.Details,

    statics: {
        propertiesDefaultValues: {
            i18n: 'Flows',
            edge: 'east',
            region: 30,
            listenFromComponentId: null
        }
    },

    // override
    construct: function (settings, customData, modulePage) {
        this.base(arguments, settings, customData, modulePage);

        q.messaging.on("Application", "accept-update-scheduler", this.onAcceptUpdateScheduler, this);
    },

    members: {
        _flowId: null,

        _createScheduler: function () {
            var control = new omna.form.task.Scheduler(true);

            return control
        },

        /**
         * Fired when changed selection of component items.
         *
         * @param data {Object} Selected item data.
         */
        onSelectionChange: function (data) {
            var task = {};

            if (data.customData) {
                this._flowId = data.customData.item.id;
                if (data.customData.item.task !== 'none') {
                    task = data.customData.item.task
                } else {
                    q.messaging.emit('Application', 'warn', this.i18nTrans('Flows', 'Messages', 'WITHOUT-TASK-NEITHER-SCHEDULER'));
                }
            } else {
                this._flowId = null;
            }

            this.setCustomData({ item: task });
        },

        onAcceptUpdateScheduler: function (data) {
            var request = new omna.request.Flows();

            request.update(this._flowId, { scheduler: data.params }, function (response) {
                if (response.successful) {
                    q.messaging.emit('Application', 'good', this.i18nTrans('Messages', 'SUCCESSFUL-UPDATING'));
                    this.emitMessaging('execute-update');
                }
            }, this);
        }
    }
});