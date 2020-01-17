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
            var request = new omna.request.Integrations();

            this.removeAll();

            request.setAsync(false);
            request.findAll(null, { with_details: true }, function (response) {
                var label, listItem, disableUnauthorized = this.isDisableUnauthorized();

                if (response.successful) response.data.forEach(function (item) {
                    label = qx.bom.Template.render(omna.I18n.trans('Titles', 'INTEGRATION'), { integration: item });
                    listItem = new qx.ui.form.ListItem(label, this.integrationLogo(item.channel), item.id);
                    listItem.setEnabled((disableUnauthorized === false) || (item.authorized === true));
                    this.add(listItem);
                }, this);
            }, this);
        },

        _applyDisableUnauthorized: function () {
            this.__loadItems();
        }
    }
});