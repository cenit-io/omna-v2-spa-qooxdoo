/**
 * @asset(qx/icon/${qx.icontheme}/16/actions/view-refresh.png)
 */
qx.Class.define("omna.action.Reload", {
    extend: omna.action.AbstractAction,

    construct: function (management) {
        this.base(arguments, management, 'reload', 'icon/16/actions/view-refresh.png');
    },

    members: {
        onExecute: function () {
            this.emitMessaging('execute-reload', { action: this });
        }
    }
});
