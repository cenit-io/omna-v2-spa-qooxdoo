qx.Class.define('omna.form.field.remote.integrations.ListBox', {
    extend: qx.ui.form.List,
    include: omna.mixin.MLogo,

    construct: function () {
        this.base(arguments);
        this.setSelectionMode('additive');
        this.__loadItems();
    },

    members: {
        __loadItems: function () {
            let request = new omna.request.Connections();

            request.setAsync(false);
            request.findAll(null, { with_details: true }, function (response) {
                let label, listItem, enabled;

                if (response.successful) response.data.forEach(function (item) {
                    label = qx.bom.Template.render(omna.I18n.trans('Titles', 'INTEGRATION'), { integration: item });
                    listItem = new qx.ui.form.ListItem(label, this.integrationLogo(item.channel), item.id);
                    listItem.set({ enabled: item.authorized === true, rich: true });
                    this.add(listItem);
                }, this);
            }, this);
        }
    }
});