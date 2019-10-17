/**
 * @asset(qx/icon/${qx.icontheme}/16/actions/document-print.png)
 */
qx.Class.define('omna.action.Print', {
    extend: omna.action.AbstractAction,

    construct: function (management) {
        this.base(arguments, management, 'print', 'icon/16/actions/document-print.png');
    },

    members: {
        onExecute: function () {
            this.emitMessaging('execute-print');
        }
    }
});
