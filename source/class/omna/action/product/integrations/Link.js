/**
 * @asset(omna/icon/16/actions/i-link.png)
 */
qx.Class.define("omna.action.product.integrations.Link", {
  extend: omna.action.integration.AbstractLink,

  construct: function (management) {
    this.base(arguments, management, 'link', 'omna/icon/16/actions/i-link.png');
  },

  members: {
    _createDlg: function () {
      let itemLabel = this.i18nTrans('SINGLE-ITEM-REFERENCE').toLowerCase(),
        caption = this.i18nTrans('Titles', 'integrations-link', [itemLabel]);

      return new omna.form.dialog.product.integrations.Link(this.getManagement(), caption, this.getIcon());
    },

    onAccept: function (e) {
      let itemLabel = this.i18nTrans('SINGLE-ITEM-REFERENCE'),
        dlg = e.getTarget(),
        item = this.getSelectedItem(),
        formData = e.getData(),
        msg;

      msg = this.i18nTrans('Messages', 'CONFIRM-LINK', [itemLabel]);
      omna.dialog.Confirm.show(msg, function (response) {
        if (response === 'yes') {
          this._doRequest('link', item.id, itemLabel, formData);
          dlg.close();
        }
      }, this);
    }
  }
});
