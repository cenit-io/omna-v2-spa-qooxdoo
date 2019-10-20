/**
 * @asset(qx/icon/${qx.icontheme}/16/actions/list-remove.png)
 */
qx.Class.define("omna.action.Remove", {
    extend: omna.action.AbstractActionWithSelectedItem,

    construct: function (management) {
        this.base(arguments, management, 'remove', 'icon/16/actions/list-remove.png');
    },

    members: {
        onExecute: function () {
            var management = this.getManagement(),
                itemLabel = this.i18nTrans('SINGLE-ITEM-REFERENCE'),
                msg = this.i18nTrans('Messages', 'CONFIRM-DELETING', [itemLabel]);

            omna.dialog.Confirm.show(msg, function (response) {
                if (response === 'yes') {
                    var request = management.getRequestManagement();

                    request.remove(this.getSelectedItem().id, function (response) {
                        if (response.successful) {
                            msg = this.i18nTrans('Messages', 'SUCCESSFUL-DELETING', [itemLabel]);
                            q.messaging.emit('Application', 'good', msg);
                            this.emitMessaging('execute-remove', { index: this.getSelectedIndex() });
                        } else {
                            msg = this.i18nTrans('Messages', 'FAILED-DELETING', [itemLabel]);
                            q.messaging.emit('Application', 'error', msg);
                        }
                    }, this);
                }
            }, this);
        }
    }
});
