/**
 * @asset(omna/icon/16/actions/scheduler-on.png)
 * @asset(omna/icon/16/actions/scheduler-off.png)
 */
qx.Class.define("omna.action.flow.Scheduler", {
    extend: omna.action.AbstractActionWithSelectedItem,

    construct: function (management) {
        this.base(arguments, management, 'scheduler', 'omna/icon/16/actions/scheduler-on.png');
    },

    members: {
        onExecute: function () {
            var management = this.getManagement(),
                item = this.getSelectedItem(),
                msg = this.i18nTrans('Messages', 'CONFIRM-SCHEDULER-' + (item.task.scheduler.active ? 'OFF' : 'ON'));

            omna.dialog.Confirm.show(msg, function (response) {
                if (response === 'yes') {
                    var request = management.getRequestManagement();

                    request.toggleSchedule(item.id, function (response) {
                        if (response.successful) this.emitMessaging('execute-reload');
                    }, this)
                }
            }, this);
        },

        onSelectionChange: function (data) {
            this.base(arguments, data);

            if (data.customData !== null) {
                if (data.customData.item.task.scheduler.active) {
                    this.set({ icon: 'omna/icon/16/actions/scheduler-off.png' })
                } else {
                    this.set({ icon: 'omna/icon/16/actions/scheduler-on.png' })
                }
            }
        }
    }
});
