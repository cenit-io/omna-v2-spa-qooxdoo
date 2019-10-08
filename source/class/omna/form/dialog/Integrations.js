qx.Class.define("omna.form.dialog.Integrations", {
    extend: omna.form.dialog.AbstractForm,
    include: [omna.mixin.MWithManagement],

    /**
     * Constructor
     *
     * @param management {omna.management.AbstractManagement}
     * @param caption {String} The caption text.
     * @param icon {String} The URL of the caption bar icon.
     */
    construct: function (management, caption, icon) {
        var settings = management.getSettings();

        this.set({ management: management, width: 500 });
        this.base(arguments, caption, icon);
    },

    members: {
        _createRenderer: function () {
            var renderer = new qx.ui.form.renderer.Single(this._form);
            renderer.getLayout().setColumnFlex(1, 0);
            renderer.getLayout().setColumnFlex(2, 1);
            this.add(renderer);
        },

        _createFormFields: function (form) {
            var list = new omna.form.field.remote.IntegrationsListBox,
                afterUnLink = new omna.form.field.LocalSelectBox();

            afterUnLink.setWidth(380);
            afterUnLink.setOptions([
                { value: 0, label: this.i18nTrans('keep_in_anywhere') },
                { value: 1, label: this.i18nTrans('remove_from_integration') },
                { value: 2, label: this.i18nTrans('remove_from_omna') },
                { value: 3, label: this.i18nTrans('remove_from_anywhere') },
            ]);

            form.add(list, this.i18nTrans('integrations'), null, 'integration_ids', form);
            form.add(afterUnLink, this.i18nTrans('after_unlink'), null, 'after_unlink', form);
        },

        setData: function (data, redefineResetter) {
            if (data.integrations) {
                data = {
                    id: data.id,
                    integration_ids: data.integrations.map(function (integration) {
                        return integration.id
                    }),
                    after_unlink: 0
                };
            }

            return this.base(arguments, data, redefineResetter);
        }
    }
});