/**
 * @asset(omna/icon/16/actions/export.png)
 */
qx.Class.define("omna.action.order.Export", {
    extend: omna.action.AbstractActionWithSelectedItem,

    construct: function (management) {
        this.base(arguments, management, 'export', 'omna/icon/16/actions/export.png');
    },

    members: {
        onExecute: function () {
            var msg = this.i18nTrans('Messages', 'CONFIRM-EXPORT');

            omna.dialog.Confirm.show(msg, function (response) {
                if (response === 'yes') {
                    this.getRequestManagement().export(this.getSelectedItem(), function (response) {
                        if (response.successful) this.openTaskDetails(response.data);
                    }, this);
                }
            }, this);
        }
    }
});
