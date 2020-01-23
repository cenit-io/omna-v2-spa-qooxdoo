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
            var item = this.getSelectedItem(),
                scheduler = item.task.scheduler,
                msg = this.i18nTrans('Messages', 'CONFIRM-SCHEDULER-' + (scheduler && scheduler.active ? 'OFF' : 'ON'));

            omna.dialog.Confirm.show(msg, function (response) {
                if (response === 'yes') {
                    this.getManagement().getRequestManagement().toggleSchedule(item.id, function (response) {
                        if (response.successful) this.emitMessaging('execute-reload');
                    }, this)
                }
            }, this);
        },

        onSelectionChange: function (data) {
            this.base(arguments, data);

            if (this.getEnabled()) {
                var scheduler = data.customData.item.task.scheduler;

                if (scheduler && scheduler.active) {
                    this.set({ icon: 'omna/icon/16/actions/scheduler-off.png' })
                } else {
                    this.set({ icon: 'omna/icon/16/actions/scheduler-on.png' })
                }
            }
        }
    }
});
