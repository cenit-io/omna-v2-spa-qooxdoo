/**
 * @asset(qx/icon/${qx.icontheme}/16/actions/document-print.png)
 */
qx.Class.define('omna.action.order.Print', {
    extend: omna.action.AbstractActionWithSelectedItem,

    construct: function (management) {
        this.base(arguments, management, 'print', 'icon/16/actions/document-print.png');
    },

    members: {
        onExecute: function () {
            var order = this.getSelectedItem(),
                module = { id: 'OrderPrintDocuments', i18n: 'Orders', 'verticalLayout': false },
                data = {
                    order: order,
                    label: this.i18nTrans('MODULE-REFERENCE-PRINT-DOCUMENTS', [order.number])
                };

            q.messaging.emit('Application', 'open-module', module, data);
        },

        onAccept: function (e) {
            this.emitMessaging('execute-update', e.getData(), { dlg: e.getTarget() });
        }
    }
});
