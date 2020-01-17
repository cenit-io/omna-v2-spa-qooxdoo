qx.Class.define('omna.form.field.remote.integrations.ChannelSelectBox', {
    extend: omna.form.field.util.AbstractSelectBox,
    include: omna.mixin.MIntegrationLogo,

    statics: {
        cellRendererClass: omna.table.cellrenderer.String
    },

    construct: function () {
        this.base(arguments);
        this.__loadItems()
    },

    members: {
        __loadItems: function () {
            var request = new omna.request.Connections();

            request.getChannels(function (response) {
                if (response.successful) response.data.forEach(function (item) {
                    this.add(new qx.ui.form.ListItem(item.title, this.integrationLogo(item.name), item.name));
                }, this);
            }, this);
        }
    }
});