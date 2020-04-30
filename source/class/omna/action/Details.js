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
            this.emitMessaging("open-details", { item: this.getSelectedItem(), index: this.getSelectedIndex() });
        },

        onOpenDetails: function (data) {
            let module = { id: this.getManagement().getSettings().id + 'Details', i18n: this.getI18nCatalog() };

            data = data.customData;
            data.label = this.i18nTrans('MODULE-REFERENCE-DETAILS', data.item);

            q.messaging.emit('Application', 'open-module', module, data);
        }
    }
});
