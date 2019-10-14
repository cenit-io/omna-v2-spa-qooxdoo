qx.Class.define('omna.form.field.remote.flows.TypeSelectBox', {
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
            var request = new omna.request.Flows();

            request.getTypes(function (response) {
                if (response.successful) response.data.forEach(function (item) {
                    this.add(new qx.ui.form.ListItem(item.title, null, item.type));
                }, this);
            }, this);
        }
    }
});