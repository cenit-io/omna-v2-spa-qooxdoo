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
    },

    members: {
        /**
         * Fired when changed selection of component items.
         *
         * @param data {Object} Selected item data.
         */
        onSelectionChange: function (data) {
            var item = data.customData ? data.customData.item.task : {};

            this._fillDescription(item.description);
            this._fillTable(item.executions, 'executions');
            this._fillTable(item.notifications, 'notifications');
            this._fillScheduler(item.scheduler || 'none');
        }
    }
});