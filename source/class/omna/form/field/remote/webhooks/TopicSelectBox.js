qx.Class.define('omna.form.field.remote.webhooks.TopicSelectBox', {
    extend: omna.form.field.util.AbstractSelectBox,

    statics: {
        cellRendererClass: omna.table.cellrenderer.String
    },

    construct: function () {
        this.base(arguments);
        this.__loadItems()
    },

    members: {
        __loadItems: function () {
            let request = new omna.request.Webhooks();

            request.getTopics(function (response) {
                if (response.successful) response.data.forEach(function (item) {
                    this.add(new qx.ui.form.ListItem(item.title, null, item.topic));
                }, this);
            }, this);
        }
    }
});