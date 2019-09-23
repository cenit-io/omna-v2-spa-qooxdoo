/**
 * @asset(qx/icon/${qx.icontheme}/16/actions/dialog-apply.png)
 */
qx.Class.define('omna.action.tenant.Startup', {
    extend: omna.action.AbstractActionWithSelectedItem,

    construct: function (management) {
        this.base(arguments, management, 'startup', 'icon/16/actions/dialog-apply.png');
    },

    members: {
        onExecute: function () {
            var settings = this.getManagement().getSettings(),
                msg = this.i18nTrans('Messages', 'CONFIRM-STARTUP');

            omna.dialog.Confirm.show(msg, function (response) {
                if (response === 'yes') {
                    var RequestManagementClass = qx.Class.getByName(settings.requestManagementClass),
                        request = new RequestManagementClass(),
                        item = this.getSelectedItem();

                    request.doStartup(item, function (response) {
                        if (response.successful) {
                            // TODO: Open task details
                        }
                    }, this);
                }
            }, this);
        },

        onSelectionChange: function (data) {
            this.base(arguments, data);
            this.setEnabled(data.customData && !data.customData.item.is_ready_to_omna ? true : false);
        }
    }
});
