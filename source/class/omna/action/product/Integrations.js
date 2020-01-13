/**
 * @asset(omna/icon/16/actions/integrations.png)
 */
qx.Class.define("omna.action.product.Integrations", {
    extend: omna.action.AbstractActionWithSelectedItem,
    include: [omna.mixin.MActionWithDlg],

    construct: function (management) {
        this.base(arguments, management, 'integrations', 'omna/icon/16/actions/integrations.png');
    },

    members: {
        _createDlg: function () {
            var itemLabel = this.i18nTrans('SINGLE-ITEM-REFERENCE').toLowerCase(),
                caption = this.i18nTrans('Titles', 'integrations', [itemLabel]);

            return new omna.form.dialog.Integrations(this.getManagement(), caption, this.getIcon());
        },

        _getCurrentIntegrations: function () {
            return this.getSelectedItem().integrations.map(function (integration) {
                return integration.id
            })
        },

        _doRequest: function (action, itemId, itemLabel, params, done) {
            if (params.integration_ids.length === 0) return done.call(this);

            var request = this.getManagement().getRequestManagement();

            request[action](itemId, params, function (response) {
                if (response.successful) {
                    this.good('SUCCESSFUL-' + action.toUpperCase(), [itemLabel]);
                    done.call(this, response);
                } else {
                    this.error('FAILED-' + action.toUpperCase(), [itemLabel]);
                }
            }, this);
        },

        onAccept: function (e) {
            var itemLabel = this.i18nTrans('SINGLE-ITEM-REFERENCE'),
                dlg = e.getTarget(),
                item = this.getSelectedItem(),
                formData = e.getData(),
                currentIntegrations = this._getCurrentIntegrations(),
                selectedIntegrations, integrationsToAdd, integrationsToDel, msg, params;

            selectedIntegrations = formData.integration_ids;
            integrationsToAdd = qx.lang.Array.exclude(qx.lang.Array.clone(selectedIntegrations), currentIntegrations);
            integrationsToDel = qx.lang.Array.exclude(qx.lang.Array.clone(currentIntegrations), selectedIntegrations);

            if (integrationsToAdd.length > 0 || integrationsToDel.length > 0) {
                msg = this.i18nTrans('Messages', 'CONFIRM-PUBLISH', [itemLabel]);
                omna.dialog.Confirm.show(msg, function (response) {
                    if (response === 'yes') {
                        params = {
                            integration_ids: integrationsToDel,
                            delete_from_omna: (formData.after_unlink & 2) === 2,
                            delete_from_integration: (formData.after_unlink & 1) === 1
                        };
                        this._doRequest('unPublish', item.id, itemLabel, params, function () {
                            params = { integration_ids: integrationsToAdd };
                            this._doRequest('publish', item.id, itemLabel, params, function () {
                                this.emitMessaging('execute-reload');
                            });
                        });
                        dlg.close();
                    }
                }, this);
            } else {
                this.warn('UNCHANGED')
            }


        }
    }
});
