/**
 * @asset(qx/icon/${qx.icontheme}/16/actions/list-add.png)
 */
qx.Class.define("omna.action.Add", {
    extend: omna.action.AbstractAction,

    construct: function (management) {
        this.base(arguments, management, 'add', 'icon/16/actions/list-add.png');
    },

    members: {
        onExecute: function () {
            var management = this.getManagement(),
                itemLabel = this.i18nTrans('SINGLE-ITEM-REFERENCE'),
                caption = this.i18nTrans('Titles', 'add', [itemLabel]),
                dlg = new omna.form.dialog.Custom(management, 'add', caption, this.getIcon());

            dlg.addListener('accept', this.onAccept, this);
            dlg.open();
        },

        onAccept: function (e) {
            var management = this.getManagement(),
                request = management.getRequestManagement(),
                itemLabel = this.i18nTrans('SINGLE-ITEM-REFERENCE'),
                dlg = e.getTarget(),
                data = e.getData();

            request.create(data, function (response) {
                if (response.successful) {
                    q.messaging.emit(
                        'Application', 'good', this.i18nTrans('Messages', 'SUCCESSFUL-ADDING', [itemLabel])
                    );
                    this.emitMessaging('execute-add', { dlg: dlg }, data);
                    dlg.close();
                } else {
                    q.messaging.emit(
                        'Application', 'error', this.i18nTrans('Messages', 'FAILED-ADDING', [itemLabel])
                    );
                }
            }, this);
        }
    }
});
