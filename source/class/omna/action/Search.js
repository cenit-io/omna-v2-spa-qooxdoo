/**
 * @asset(qx/icon/${qx.icontheme}/16/actions/system-search.png)
 */
qx.Class.define("omna.action.Search", {
    extend: omna.action.AbstractAction,

    construct: function (management) {
        this.base(arguments, management, 'search', 'icon/16/actions/system-search.png');
    },

    members: {
        onExecute: function () {
            if (!this.dlg) {
                var caption = this.i18nTrans('Titles', 'search');

                this.dlg = new omna.form.dialog.Search(this.getManagement(), caption, this.getIcon());
                this.dlg.addListener('accept', this.onAccept, this);
            }

            this.dlg.open();
        },

        onAccept: function (e) {
            var data = e.getData();

            // Remove empty attrs.
            for (var i in data) {
                if (data[i] === undefined) {
                    delete data[i]
                }
            }

            this.emitMessaging('execute-search', e.getData(), { dlg: e.getTarget() });
        }
    }
});