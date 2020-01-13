/**
 * @asset(qx/icon/${qx.icontheme}/16/actions/process-stop.png)
 */
qx.Class.define("omna.action.Cancel", {
    extend: omna.action.AbstractActionWithSelectedItem,

    construct: function (management) {
        this.base(arguments, management, 'cancel', 'icon/16/actions/process-stop.png');
    },

    members: {
        onExecute: function () {
            this.setEnabled(false);
            var management = this.getManagement(),
                itemLabel = this.i18nTrans('SINGLE-ITEM-REFERENCE'),
                msg = this.i18nTrans('Messages', 'CONFIRM-CANCELLATION', [itemLabel]);

            omna.dialog.Confirm.show(msg, function (response) {
                if (response === 'yes') {
                    var request = management.getRequestManagement();

                    request.remove(this.getSelectedItem().id, function (response) {
                        if (response.successful) {
                            msg = this.i18nTrans('Messages', 'SUCCESSFUL-CANCELLATION', [itemLabel]);
                            q.messaging.emit('Application', 'good', msg);
                            this.emitMessaging('execute-reload');
                        } else {
                            msg = this.i18nTrans('Messages', 'FAILED-CANCELLATION', [itemLabel]);
                            q.messaging.emit('Application', 'error', msg);
                        }
                    }, this);
                }
                this.setEnabled(true);
            }, this);
        }
    }
});
