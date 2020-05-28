qx.Class.define("omna.form.field.MultiSelectBox", {
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

    construct: function () {
        // TODO: Needs revision, does not work properly
        q.messaging.emit('Application', 'warn', this.constructor.classname + ': Needs revision, does not work properly');
        this.base(arguments);
    },

    members: {
        _applyOptions: function (items) {
            items.forEach(function (item) {
                let label, model, icon;

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
            let control;

            switch ( id ) {
                case "list":
                    control = this.base(arguments, id).set({ selectionMode: "multi" });
                    break;
            }

            return control || this.base(arguments, id);
        },
    }
});