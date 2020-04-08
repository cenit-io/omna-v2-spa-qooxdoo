qx.Class.define("omna.form.field.LocalSelectBox", {
    extend: omna.form.field.util.AbstractSelectBox,

    statics: {
        cellRendererClass: omna.table.cellrenderer.String
    },

    properties: {
        options: {
            check: Array,
            init: [],
            apply: '_applyOptions'
        },

        i18n: {
            check: String,
            nullable: true
        }
    },

    members: {
        _applyOptions: function (items) {
            let i18n = this.getI18n();

            items.forEach(function (item) {
                let label, model, icon;

                if (qx.lang.Type.isObject(item)) {
                    model = item.value;
                    label = item.label || model;
                    icon = item.icon;
                } else {
                    label = model = item;
                }

                if (i18n) label = omna.I18n.trans(i18n, 'Labels', label);

                icon = icon || null;

                this.add(new qx.ui.form.ListItem(label, icon, model));
            }, this);
        }
    }
});