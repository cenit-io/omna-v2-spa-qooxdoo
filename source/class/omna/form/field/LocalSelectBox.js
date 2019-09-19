qx.Class.define("omna.form.field.LocalSelectBox", {
    extend: omna.form.field.util.AbstractSelectBox,

    statics: {
        cellRendererClass: omna.table.cellrenderer.String
    },

    properties: {
        options: {
            check: 'String',
            init: '[]',
            apply: '_applyOptions'
        }
    },

    members: {
        _applyOptions: function (value) {
            var options = qx.lang.Json.parse(value);

            options.forEach(function (item) {
                this.add(new qx.ui.form.ListItem(item.label, null, item.value));
            }, this);
        }
    }
});