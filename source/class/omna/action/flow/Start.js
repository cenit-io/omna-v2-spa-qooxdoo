/**
 * @asset(qx/icon/${qx.icontheme}/16/actions/media-playback-start.png)
 */
qx.Class.define("omna.action.flow.Start", {
    extend: omna.action.AbstractActionWithSelectedItem,

    construct: function (management) {
        this.base(arguments, management, 'start', 'icon/16/actions/media-playback-start.png');
    },

    members: {
        onExecute: function () {
            let msg = this.i18nTrans('Messages', 'CONFIRM-START');

            omna.dialog.Confirm.show(msg, function (response) {
                if (response === 'yes') this.getRequestManagement().start();
            }, this);
        }
    }
});
