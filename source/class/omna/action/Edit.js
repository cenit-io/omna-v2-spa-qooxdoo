/**
 * @asset(omna/icon/16/actions/edit.png)
 */
qx.Class.define("omna.action.Edit", {
    extend: omna.action.AbstractActionWithSelectedItem,
    include: [omna.mixin.MActionWithDlg],

    construct: function (management) {
        this.base(arguments, management, 'edit', 'omna/icon/16/actions/edit.png');
    },

    members: {
        _createDlg: function () {
            let itemLabel = this.i18nTrans('SINGLE-ITEM-REFERENCE'),
                caption = this.i18nTrans('Titles', 'edit', [itemLabel]),
                dlg = new omna.form.dialog.Custom(this.getManagement(), 'edit', caption, this.getIcon());

            dlg.setData(this.getSelectedItem());

            return dlg;
        },

        onAccept: function (e) {
            let management = this.getManagement(),
                request = management.getRequestManagement(),
                dlg = e.getTarget(),
                data = e.getData();

            dlg.setEnabled(false);

            request.update(this.getSelectedItem().id, data, function (response) {
                dlg.setEnabled(true);
                if (response.successful) {
                    this.emitMessaging('execute-update', { dlg: dlg }, data);
                    dlg.close();
                }
            }, this);
        }
    }
});
