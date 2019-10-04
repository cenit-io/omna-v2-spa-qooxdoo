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
            if (!this.__dlg) {
                var caption = this.i18nTrans('Titles', 'search');

                this.__dlg = new omna.form.dialog.Search(this.getManagement(), caption, this.getIcon());
                this.__dlg.addListener('appear', this.onAppear, this);
                this.__dlg.addListener('accept', this.onAccept, this);
            }

            this.__dlg.open();
        },

        onAccept: function (e) {
            var data = e.getData();

            // Remove empty attrs.
            for (var i in data) if (data[i] === undefined) delete data[i];

            this.emitMessaging('execute-search', { dlg: e.getTarget() }, data);

            if (qx.lang.Object.isEmpty(data)) {
                this.resetTextColor();
                this.resetFont()
            } else {
                this.set({ textColor: 'highlight', font: 'bold' });
            }
        }
    },

    destruct: function () {
        this.__dlg && this.__dlg.destroy();
    }
});