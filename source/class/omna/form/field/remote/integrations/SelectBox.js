qx.Class.define('omna.form.field.remote.integrations.SelectBox', {
    extend: omna.form.field.util.AbstractSelectBox,

    construct: function () {
        this.base(arguments);
        this.__loadItems();
    },

    members: {
        __loadItems: function () {
            var request = new omna.request.Integrations();

            request.setAsync(false);
            request.findAll(null, { with_details: true }, function (response) {
                var label, listItem;

                if (response.successful) response.data.forEach(function (item) {
                    label = qx.bom.Template.render(omna.I18n.trans('Titles', 'INTEGRATION'), { integration: item });
                    listItem = new qx.ui.form.ListItem(label, null, item.id);
                    listItem.setEnabled(item.authorized);
                    this.add(listItem);
                }, this);
            }, this);
        }
    }
});