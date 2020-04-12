qx.Class.define("omna.form.dialog.variant.integrations.UnLink", {
    extend: omna.form.dialog.integration.AbstractLink,

    members: {
        setData: function (data, redefineResetter) {
            let model, integration;

            this._integrationsListBox.getListItems().forEach(function (li) {
                model = li.getModel();
                integration = data.integrations.find((i) => i.id === model);
                li.set({ visibility: integration ? 'visible' : 'excluded', enabled: integration !== null })
            }, this);

            data = { id: data.id };

            return this.base(arguments, data, redefineResetter);
        }
    }
});