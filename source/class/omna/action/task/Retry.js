/**
 * @asset(omna/icon/16/actions/retry.png)
 */
qx.Class.define("omna.action.task.Retry", {
  extend: omna.action.AbstractActionWithSelectedItem,
  include: [omna.mixin.MSettings],

  construct: function (management) {
    this.base(arguments, management, 'retry', 'omna/icon/16/actions/retry.png');
    if (this.isDevelopment()) {
      this.setEnablingRules('status === "failed" || status === "completed"');
    } else {
      this.setEnablingRules('status === "failed"');
    }
  },

  members: {
    onExecute: function () {
      let msg = this.i18nTrans('Messages', 'CONFIRM-RETRY');

      omna.dialog.Confirm.show(msg, function (response) {
        let request = this.getManagement().getRequestManagement();

        if (response === 'yes') request.retry(this.getSelectedItem().id, function (response) {
          if (response.successful) this.emitMessaging('execute-reload');
        }, this);
      }, this);
    }
  }
});
