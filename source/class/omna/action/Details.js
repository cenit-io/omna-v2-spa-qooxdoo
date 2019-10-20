/**
 * @asset(omna/icon/16/actions/details.png)
 */
qx.Class.define('omna.action.Details', {
    extend: omna.action.AbstractActionWithSelectedItem,

    construct: function (management) {
        this.base(arguments, management, 'details', 'omna/icon/16/actions/details.png');
    },

    members: {
        onExecute: function () {
            var item = this.getSelectedItem(),
                module = { id: this.getManagement().getSettings().id + 'Details', i18n: this.getI18nCatalog() },
                data = {
                    item: item,
                    index: this.getSelectedIndex(),
                    label: this.i18nTrans('MODULE-REFERENCE-DETAILS', item)
                };

            q.messaging.emit('Application', 'open-module', module, data);
        }
    }
});
