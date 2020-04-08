qx.Class.define("omna.form.dialog.IntegrationsUnLink", {
    extend: omna.form.dialog.IntegrationsAbstractLink,

    members: {
        _createFormFields: function (form) {
            this.base(arguments, form);

            let afterUnLink = new omna.form.field.LocalSelectBox(),
                validator = new omna.form.validator.SelectBox;

            afterUnLink.set({
                width: 480,
                options: [
                    { value: null, label: '-' },
                    { value: false, label: this.i18nTrans('not_remove_from_integration') },
                    { value: true, label: this.i18nTrans('remove_from_integration') },
                ],
                required: true,
            });

            form.add(afterUnLink, this.i18nTrans('after_unlink'), validator, 'after_unlink', form);
        },

        _createIntegrationField: function (form) {
            return this._integrationsListBox = new omna.form.field.remote.integrations.ListBox;
        },

        setData: function (data, redefineResetter) {
            let model, integration;

            this._integrationsListBox.getListItems().forEach(function (li) {
                model = li.getModel();
                integration = data.integrations.find((i) => i.id === model);
                li.set({ visibility: integration ? 'visible' : 'excluded', enabled: integration !== null })
            }, this);

            data = { id: data.id, after_unlink: null };

            return this.base(arguments, data, redefineResetter);
        },

        getData: function () {
            let data = this.base(arguments);

            data = { integration_ids: data.integration_ids, delete_from_integration: data.after_unlink === true }

            return data;
        }
    }
});