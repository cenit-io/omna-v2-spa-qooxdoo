/**
 * @asset(omna/icon/16/actions/i-unlink.png)
 */
qx.Class.define("omna.action.product.IntegrationsUnLink", {
    extend: omna.action.product.IntegrationsAbstractLink,

    construct: function (management) {
        this.base(arguments, management, 'unlink', 'omna/icon/16/actions/i-unlink.png');
        this.setEnablingRules('integrations.length > 0');
    },

    members: {
        _createDlg: function () {
            var itemLabel = this.i18nTrans('SINGLE-ITEM-REFERENCE').toLowerCase(),
                caption = this.i18nTrans('Titles', 'integrations-unlink', [itemLabel]);

            return new omna.form.dialog.IntegrationsUnLink(this.getManagement(), caption, this.getIcon());
        },

        onAccept: function (e) {
            var itemLabel = this.i18nTrans('SINGLE-ITEM-REFERENCE'),
                dlg = e.getTarget(),
                item = this.getSelectedItem(),
                formData = e.getData(),
                msg;

            msg = this.i18nTrans('Messages', 'CONFIRM-UNLINK', [itemLabel]);
            omna.dialog.Confirm.show(msg, function (response) {
                if (response === 'yes') {
                    this._doRequest('unPublish', item.id, itemLabel, formData);
                    dlg.close();
                }
            }, this);
        }
    }
});
