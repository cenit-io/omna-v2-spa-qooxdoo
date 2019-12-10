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
                        var item = this.getSelectedItem(),
                            type = dlg.getImportType();

                        this.getRequestManagement().doImportTask(item.id, type, function (response) {
                            if (response.successful) this.openTaskDetails(response.data);
                        }, this);
                    }
                }
            }, this);
        },

        onSelectionChange: function (data) {
            this.base(arguments, data);
            this.__previousStatus = ((data.customData || {}).item || {}).authorized ? true : false;
            this.setEnabled(this.__previousStatus);
        }
    }
});
