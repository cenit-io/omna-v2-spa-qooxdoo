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
            let msg = this.i18nTrans('Messages', 'CONFIRM-EXPORT');

            omna.dialog.Confirm.show(msg, function (response) {
                if (response === 'yes') this.getRequestManagement().export(this.getSelectedItem());
            }, this);
        }
    }
});
