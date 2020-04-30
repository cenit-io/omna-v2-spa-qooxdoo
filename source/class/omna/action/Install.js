/**
 * @asset(omna/icon/16/actions/go-bottom.png)
 */
qx.Class.define("omna.action.Install", {
    extend: omna.action.AbstractActionWithSelectedItem,

    construct: function (management) {
        this.base(arguments, management, 'install', 'omna/icon/16/actions/go-bottom.png');
    },

    members: {
        onExecute: function () {
            this.setEnabled(false);

            let management = this.getManagement(),
                itemLabel = this.i18nTrans('SINGLE-ITEM-REFERENCE'),
                msg = this.i18nTrans('Messages', 'CONFIRM-INSTALL', [itemLabel]);

            omna.dialog.Confirm.show(msg, function (response) {
                if (response === 'yes') management.getRequestManagement().install(this.getSelectedItem().id);
                this.setEnabled(true);
            }, this);
        }
    }
});
