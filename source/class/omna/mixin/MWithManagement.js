qx.Mixin.define('omna.mixin.MWithManagement', {

    properties: {
        management: {
            check: 'omna.management.AbstractManagement'
        }
    },

    members: {
        /**
         * Sends a message on the current module channel and informs all matching route handlers.
         *
         * @param msgId {String} Messaging identifier.
         * @param customData {Object?} The given custom data that should be propagated.
         * @param params {Object?} The extra params that should be propagated.
         * @param managementId {String} Management identifier.
         */
        emitMessaging: function (msgId, customData, params, managementId) {
            if (qx.lang.Type.isString(params)) {
                managementId = params;
                params = null;
            }

            let channel = 'C' + (managementId || this.getManagement().getSettings().id);

            q.messaging.emit(channel, msgId, params, customData);
        },

        getRequestManagement: function () {
            return this.getManagement().getRequestManagement();
        },

        getCustomData: function () {
            return this.getManagement().getCustomData();
        },

        getI18nCatalog: function () {
            return this.getManagement().getI18nCatalog()
        }
    }
});
