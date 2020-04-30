/**
 * @asset(qx/icon/${qx.icontheme}/16/actions/system-search.png)
 */
qx.Class.define("omna.action.Search", {
    extend: omna.action.AbstractAction,
    include: [omna.mixin.MActionWithDlg],

    construct: function (management) {
        this.base(arguments, management, 'search', 'icon/16/actions/system-search.png');
    },

    members: {
        _createDlg: function () {
            let caption = this.i18nTrans('Titles', 'search');

            return new omna.form.dialog.Search(this.getManagement(), caption, this.getIcon());
        },

        getSelectedItem: function () {
            return this.__dlg.getData();
        },

        onAccept: function (e) {
            let data = e.getData();

            // Remove empty attrs.
            for (let i in data) if (data[i] === undefined) delete data[i];

            this.emitMessaging('execute-search', { dlg: e.getTarget() }, data);

            if (qx.lang.Object.isEmpty(data)) {
                this.resetTextColor();
                this.resetFont()
            } else {
                this.set({ textColor: 'highlight', font: 'bold' });
            }
        }
    }
});