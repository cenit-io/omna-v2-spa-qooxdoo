/**
 * @asset(omna/icon/16/actions/import.png)
 */
qx.Class.define("omna.action.integration.Import", {
    extend: omna.action.AbstractActionWithSelectedItem,

    construct: function (management) {
        this.base(arguments, management, 'import', 'omna/icon/16/actions/import.png');
        this.setEnablingRules('authorized');
    },

    members: {
        onExecute: function () {
            omna.form.dialog.Import.show(this.getManagement(), this.getSelectedItem(), function (response, dlg) {
                if (response === 'yes') {
                    if (response === 'yes') {
                        var item = this.getSelectedItem(),
                            type = dlg.getImportType();

                        this.getRequestManagement().doImportTask(item.id, type);
                    }
                }
            }, this);
        }
    }
});
