/**
 * @asset(qx/icon/${qx.icontheme}/16/status/security-high.png)
 * @asset(qx/icon/${qx.icontheme}/16/status/security-low.png)
 */
qx.Class.define("omna.action.Authorize", {
    extend: omna.action.AbstractActionWithSelectedItem,

    construct: function (management) {
        this.base(arguments, management, 'authorize', 'icon/16/status/security-high.png');
    },

    members: {
        onExecute: function () {
            var management = this.getManagement(),
                selectedItemId = this.getSelectedItem().id,
                isAuthorized = this.getSelectedItem().authorized,
                msg = this.i18nTrans('Messages', 'CONFIRM-' + (isAuthorized ? 'UNAUTHORIZE' : 'AUTHORIZE'));

            omna.dialog.Confirm.show(msg, function (response) {
                if (response === 'yes') {
                    var request = management.getRequestManagement();

                    if (isAuthorized) {
                        request.unauthorize(selectedItemId, function (response) {
                            if (response.successful) this.emitMessaging('execute-reload');
                        }, this)
                    } else {
                        request.authorize(selectedItemId);
                    }
                }
            }, this);
        },

        onSelectionChange: function (data) {
            this.base(arguments, data);

            if (data.customData !== null) {
                if (data.customData.item.authorized) {
                    this.set({ label: 'unauthorize', icon: 'icon/16/status/security-low.png' })
                } else {
                    this.set({ label: 'authorize', icon: 'icon/16/status/security-high.png' })
                }
            }
        }
    }
});
