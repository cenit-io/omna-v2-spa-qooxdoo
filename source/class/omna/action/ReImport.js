/**
 * @asset(omna/icon/16/actions/import.png)
 */
qx.Class.define("omna.action.ReImport", {
    extend: omna.action.AbstractActionWithSelectedItem,

    construct: function (management) {
        this.base(arguments, management, 'reimport', 'omna/icon/16/actions/import.png');
    },

    members: {
        onExecute: function () {
            var msg = this.i18nTrans('Messages', 'CONFIRM-REIMPORT');

            omna.dialog.Confirm.show(msg, function (response) {
                if (response === 'yes') this.getRequestManagement().reImport();
            }, this);
        }
    }
});
