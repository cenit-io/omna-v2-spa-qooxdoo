qx.Class.define("omna.form.field.TextField", {
  extend: qx.ui.form.TextField,
  include: [
    omna.form.field.util.MSetProperties,
    omna.form.field.util.MPatterns
  ],

  statics: {
    cellRendererClass: omna.table.cellrenderer.String,
    validatorClass: omna.form.validator.TextField
  },

  members: {
    setValue: function (value) {
      if (qx.lang.Type.isObject(value)) {
        value = value.toString();
      } else if (qx.lang.Type.isArray(value)) {
        value = value.join(',');
      } else if (qx.lang.Type.isBoolean(value)) {
        value = value ? 'true' : 'false';
      }

      this.base(arguments, value);
    }
  }
});