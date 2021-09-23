qx.Class.define("omna.form.field.MultiSelectBox", {
  extend: omna.form.field.util.AbstractMultiSelectBox,

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

        this.add(new omna.form.field.ListItem(label, icon, model));
      }, this);
    },
  }
});