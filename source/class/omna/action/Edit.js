qx.Class.define("omna.action.Edit", {
    extend: omna.action.AbstractActionWithSelectedItem,

    construct: function (management) {
        this.base(arguments, management, 'edit', 'omna/icon/16/actions/edit.png');
    },

    members: {
        onExecute: function () {
            var itemLabel = this.i18nTrans('SINGLE-ITEM-REFERENCE'),
                caption = this.i18nTrans('Titles', 'Edit', [itemLabel]),
                dlg = new omna.form.dialog.Custom(this.getManagement(), 'edit', caption, this.getIcon());

            dlg.addListener('accept', this.onAccept, this);
            dlg.setData(this.getSelectedItem());
            dlg.open();
        },

        onAccept: function (e) {
            this.emitMessaging('execute-update', e.getData(), { dlg: e.getTarget() });
        }
    }
});
