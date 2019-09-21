/**
 * @asset(omna/icon/16/actions/edit.png)
 */
qx.Class.define("omna.action.Edit", {
    extend: omna.action.AbstractActionWithSelectedItem,

    construct: function (management) {
        this.base(arguments, management, 'edit', 'omna/icon/16/actions/edit.png');
    },

    members: {
        onExecute: function () {
            var itemLabel = this.i18nTrans('SINGLE-ITEM-REFERENCE'),
                caption = this.i18nTrans('Titles', 'edit', [itemLabel]),
                dlg = new omna.form.dialog.Custom(this.getManagement(), 'edit', caption, this.getIcon());

            dlg.addListener('accept', this.onAccept, this);
            dlg.setData(this.getSelectedItem());
            dlg.open();
        },

        onAccept: function (e) {
            var management = this.getManagement(),
                request = management.getRequestManagement(),
                itemLabel = this.i18nTrans('SINGLE-ITEM-REFERENCE'),
                dlg = e.getTarget(),
                data = e.getData();

            request.update(data.id, data, function (response) {
                if (response.successful) {
                    q.messaging.emit(
                        'Application', 'good', this.i18nTrans('Messages', 'SUCCESSFUL-UPDATING', [itemLabel])
                    );
                    this.emitMessaging('execute-update', { dlg: dlg }, data);
                    dlg.close();
                } else {
                    q.messaging.emit(
                        'Application', 'error', this.i18nTrans('Messages', 'FAILED-UPDATING', [itemLabel])
                    );
                }
            }, this);
        }
    }
});
