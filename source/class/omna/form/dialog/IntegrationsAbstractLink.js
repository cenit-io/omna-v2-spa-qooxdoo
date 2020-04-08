qx.Class.define("omna.form.dialog.IntegrationsAbstractLink", {
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
        this.set({ management: management, width: 600 });
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
            var list = this._createIntegrationField();

            list.setRequired(true);

            form.add(list, this.i18nTrans('integrations'), null, 'integration_ids', form);
        }
    }
});