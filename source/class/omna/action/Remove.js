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
      this.setEnabled(false);
      let management = this.getManagement(),
        itemLabel = this.i18nTrans('SINGLE-ITEM-REFERENCE'),
        msg = this.i18nTrans('Messages', 'CONFIRM-DELETING', [itemLabel]);

      omna.dialog.Confirm.show(msg, function (response) {
        if (response === 'yes') {
          let request = management.getRequestManagement();

          request.remove(this.getSelectedItem().id, function (response) {
            if (response.successful) {
              this.emitMessaging('execute-remove', { index: this.getSelectedIndex() });
            }
          }, this);
        }
        this.setEnabled(true);
      }, this);
    }
  }
});
