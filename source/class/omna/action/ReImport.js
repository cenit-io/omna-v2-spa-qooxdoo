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
            var settings = this.getManagement().getSettings(),
                msg = this.i18nTrans('Messages', 'CONFIRM-REIMPORT');

            omna.dialog.Confirm.show(msg, function (response) {
                if (response === 'yes') {
                    var RequestManagementClass = qx.Class.getByName(settings.requestManagementClass),
                        request = new RequestManagementClass(),
                        item = this.getSelectedItem();

                    request.reImport(item, function (response) {
                        // TODO: Open task details
                    }, this);
                }
            }, this);
        }
    }
});
