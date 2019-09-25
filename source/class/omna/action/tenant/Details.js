/**
 * @asset(omna/icon/16/actions/details.png)
 */
qx.Class.define('omna.action.tenant.Details', {
    extend: omna.action.AbstractActionWithSelectedItem,

    construct: function (management) {
        this.base(arguments, management, 'details', 'omna/icon/16/actions/details.png');
    },

    members: {
        onExecute: function () {
            var tenant = this.getSelectedItem(),
                module = { id: 'TenantDetails', i18n: 'Tenants' },
                data = {
                    item: tenant,
                    index: this.getSelectedIndex(),
                    label: this.i18nTrans('MODULE-REFERENCE-DETAILS', [tenant.name])
                };

            q.messaging.emit('Application', 'open-module', module, data);
        },

        onAccept: function (e) {
            this.emitMessaging('execute-update', e.getData(), { dlg: e.getTarget() });
        }
    }
});
