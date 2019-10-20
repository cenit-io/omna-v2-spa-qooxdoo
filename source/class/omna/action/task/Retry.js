/**
 * @asset(omna/icon/16/actions/retry.png)
 */
qx.Class.define("omna.action.task.Retry", {
    extend: omna.action.AbstractActionWithSelectedItem,

    construct: function (management) {
        this.base(arguments, management, 'retry', 'omna/icon/16/actions/retry.png');
    },

    members: {
        onExecute: function () {
            var msg = this.i18nTrans('Messages', 'CONFIRM-RETRY');

            omna.dialog.Confirm.show(msg, function (response) {
                var request = this.getManagement().getRequestManagement();

                if (response === 'yes') request.retry(this.getSelectedItem().id, function (response) {
                    if (response.successful) this.emitMessaging('execute-reload');
                }, this);
            }, this);
        },

        onSelectionChange: function (data) {
            this.base(arguments, data);
            this.setEnabled(((data.customData || {}).item || {}).status === 'failed');
        }
    }
});
