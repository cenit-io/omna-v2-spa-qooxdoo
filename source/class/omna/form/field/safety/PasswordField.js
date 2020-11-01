qx.Class.define("omna.form.field.safety.PasswordField", {
  extend: qx.ui.form.PasswordField,
  include: [
    omna.form.field.util.MSetProperties,
    omna.form.field.util.MPatterns
  ],

  statics: {
    cellRendererClass: omna.table.cellrenderer.String,
    validatorClass: omna.form.validator.TextField
  }
});