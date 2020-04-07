qx.Class.define('omna.form.field.remote.integrations.SelectBox', {
    extend: omna.form.field.util.AbstractSelectBox,
    include: omna.mixin.MLogo,

    construct: function () {
        this.base(arguments);
        this.__loadItems();
    },

    properties: {
        disableUnauthorized: {
            check: 'Boolean',
            init: true,
            apply: '_applyDisableUnauthorized'
        }
    },

    members: {
        __loadItems: function () {
            let enabled, request = new omna.request.Connections();

            this.removeAll();

            request.setAsync(false);
            request.findAll(null, { with_details: true }, function (response) {
                var label, listItem, disableUnauthorized = this.isDisableUnauthorized();

                if (response.successful) response.data.forEach(function (item) {
                    label = qx.bom.Template.render(omna.I18n.trans('Titles', 'INTEGRATION'), { integration: item });
                    enabled = item.authorized === (disableUnauthorized === false) || (item.authorized === true);

                    listItem = new qx.ui.form.ListItem(label, this.integrationLogo(item.channel), item.id);
                    listItem.set({ enabled: enabled, rich: true });

                    this.add(listItem);
                }, this);
            }, this);
        },

        _applyDisableUnauthorized: function () {
            this.__loadItems();
        }
    }
});