/**
 * @asset(omna/icon/16/actions/switch_tenant.png)
 */
qx.Class.define("omna.action.tenant.Switch", {
    extend: omna.action.AbstractActionWithSelectedItem,

    construct: function (management) {
        this.base(arguments, management, 'switch', 'omna/icon/16/actions/switch_tenant.png');
    },

    members: {
        onExecute: function () {
            var msg = this.i18nTrans('Messages', 'CONFIRM-SWITCH');

            omna.dialog.Confirm.show(msg, function (response) {
                if (response === 'yes') omna.request.Session.setProfile(this.getSelectedItem());
            }, this);
        },

        _checkEnablingRules: function (selectedItem) {
            return omna.request.Session.getProfile().id !== selectedItem.id
        }
    }
});
