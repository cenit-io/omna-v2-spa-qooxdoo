/**
 * @asset(qx/icon/${qx.icontheme}/16/actions/list-add.png)
 */
qx.Class.define("omna.action.Add", {
    extend: omna.action.AbstractAction,
    include: [omna.mixin.MActionWithDlg],

    construct: function (management) {
        this.base(arguments, management, 'add', 'icon/16/actions/list-add.png');
    },

    members: {
        _createDlg: function () {
            var management = this.getManagement(),
                itemLabel = this.i18nTrans('SINGLE-ITEM-REFERENCE'),
                caption = this.i18nTrans('Titles', 'add', [itemLabel]);

            return new omna.form.dialog.Custom(management, 'add', caption, this.getIcon());
        },

        onAccept: function (e) {
            var management = this.getManagement(),
                request = management.getRequestManagement(),
                dlg = e.getTarget(),
                data = e.getData();

            dlg.setEnabled(false);

            request.create(data, function (response) {
                dlg.setEnabled(true);
                if (response.successful) {
                    this.emitMessaging('execute-add', { dlg: dlg }, data);
                    dlg.close();
                }
            }, this);
        }
    }
});
