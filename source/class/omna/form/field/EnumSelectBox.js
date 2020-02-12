qx.Class.define("omna.form.field.EnumSelectBox", {
    extend: omna.form.field.util.AbstractSelectBox,

    statics: {
        cellRendererClass: omna.table.cellrenderer.String
    },

    properties: {
        options: {
            check: Array,
            init: [],
            apply: '_applyOptions'
        }
    },

    members: {
        _applyOptions: function (items) {
            items.forEach(function (item) {
                var label, model, icon;

                if (qx.lang.Type.isObject(item)) {
                    model = item.value;
                    label = item.label || model;
                    icon = item.icon;

                    if (item.i18n) label = omna.I18n.trans(item.i18n, 'Labels', label)
                } else {
                    label = model = item;
                }

                icon = icon || null;

                this.add(new qx.ui.form.ListItem(label, icon, model));
            }, this);
        },

        // overridden
        _createChildControlImpl: function (id, hash) {
            var control;

            switch ( id ) {
                case "list":
                    control = this.base(arguments, id).set({ selectionMode: "additive" });
                    break;
            }

            return control || this.base(arguments, id);
        },
    }
});