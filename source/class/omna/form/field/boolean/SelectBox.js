qx.Class.define("omna.form.field.boolean.SelectBox", {
  extend: omna.form.field.util.AbstractSelectBox,

  statics: {
    cellRendererClass: omna.table.cellrenderer.Boolean,

    parseValue: function (value) {
      if (qx.lang.Type.isString(value)) value = value.toLowerCase();

      return value === true || value === 'true' || value === 'on' || value === 1 || value === '1';
    }
  },

  construct: function () {
    this.base(arguments);
    this.setRequired(true);
    this.add(new qx.ui.form.ListItem(this.tr('Common.Labels.True'), null, true));
    this.add(new qx.ui.form.ListItem(this.tr('Common.Labels.False'), null, false));
  }
});