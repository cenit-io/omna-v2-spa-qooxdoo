qx.Class.define("omna.form.field.boolean.CheckBox", {
  extend: qx.ui.form.CheckBox,
  include: omna.form.field.util.MSetProperties,

  statics: {
    cellRendererClass: omna.table.cellrenderer.Boolean,

    parseValue: function (value) {
      if (qx.lang.Type.isString(value)) value = value.toLowerCase();

      return value === true || value === 'true' || value === 'on' || value === 1 || value === '1';
    }
  },

  // override
  construct: function (label) {
    this.base(arguments, label);
    this.setAlignY('middle');
  }
});