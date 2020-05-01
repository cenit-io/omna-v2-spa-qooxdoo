/**
 * @asset(omna/icon/16/actions/details.png)
 */
qx.Class.define('omna.action.Details', {
    extend: omna.action.AbstractActionWithSelectedItem,

    construct: function (management) {
        this.base(arguments, management, 'details', 'omna/icon/16/actions/details.png');

        this.addMessagingListener("open-details", this.onOpenDetails);
    },

    members: {
        onExecute: function () {
            let customData = { item: this.getSelectedItem(), index: this.getSelectedIndex() }

            this.emitMessaging("open-details", customData, this.getBaseParams());
        },

        onOpenDetails: function (data) {
            let module = { id: this.getManagement().getSettings().id + 'Details', i18n: this.getI18nCatalog() },
                customData = data.customData;

            customData.label = this.i18nTrans('MODULE-REFERENCE-DETAILS', customData.item);
            customData.params = data.params;

            q.messaging.emit('Application', 'open-module', module, customData);
        }
    }
});
