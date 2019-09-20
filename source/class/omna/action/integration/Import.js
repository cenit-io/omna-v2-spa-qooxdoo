/**
 * @asset(omna/icon/16/actions/import.png)
 */
qx.Class.define("omna.action.integration.Import", {
    extend: omna.action.AbstractActionWithSelectedItem,

    construct: function (management) {
        this.base(arguments, management, 'import', 'omna/icon/16/actions/import.png');
    },

    members: {
        onExecute: function () {
            omna.form.dialog.Import.show(this.getManagement(), this.getSelectedItem(), function (response, dlg) {
                if (response === 'yes') {
                    if (response === 'yes') {
                        var request = new omna.request.Integrations(),
                            item = this.getSelectedItem(),
                            type = dlg.getImportType(),
                            msg;

                        request.import(item.id, type, function (response) {
                            if (response.successful) {
                                msg = this.i18nTrans('Messages', 'SUCCESSFUL-IMPORT', [type]);
                                q.messaging.emit('Application', 'good', msg);
                            } else {
                                msg = this.i18nTrans('Messages', 'FAILED-IMPORT', [type]);
                                q.messaging.emit('Application', 'error', msg);
                            }
                        }, this);
                    }
                    console.log(response,);
                }
            }, this);
        },

        onSelectionChange: function (data) {
            this.base(arguments, data);
            this.setEnabled(data.customData && data.customData.item.authorized);
        }
    }
});
