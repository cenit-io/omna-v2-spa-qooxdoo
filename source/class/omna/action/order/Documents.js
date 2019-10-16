/**
 * @asset(omna/icon/16/actions/documents.png)
 */
qx.Class.define('omna.action.order.Documents', {
    extend: omna.action.AbstractActionWithSelectedItem,

    construct: function (management) {
        this.base(arguments, management, 'documents', 'omna/icon/16/actions/documents.png');
    },

    members: {
        onExecute: function () {
            var order = this.getSelectedItem(),
                module = { id: 'OrderDocuments', i18n: 'Orders', 'verticalLayout': false },
                data = {
                    order: order,
                    label: this.i18nTrans('MODULE-REFERENCE-PRINT-DOCUMENTS', order)
                };

            q.messaging.emit('Application', 'open-module', module, data);
        },

        onAccept: function (e) {
            this.emitMessaging('execute-update', e.getData(), { dlg: e.getTarget() });
        }
    }
});
