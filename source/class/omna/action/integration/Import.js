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
                            type = dlg.getImportType();

                        request.doImportTask(item.id, type, function (response) {
                            // TODO: Open task details
                        }, this);
                    }
                }
            }, this);
        },

        onSelectionChange: function (data) {
            this.base(arguments, data);
            this.setEnabled(((data.customData || {}).item || {}).authorized ? true : false);
        }
    }
});
