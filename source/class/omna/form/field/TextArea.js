qx.Class.define("omna.form.field.TextArea", {
  extend: qx.ui.form.TextArea,
  include: [
    omna.form.field.util.MSetProperties,
    omna.form.field.util.MPatterns
  ],

  statics: {
    cellRendererClass: omna.table.cellrenderer.String,
    validatorClass: omna.form.validator.TextArea
  }
});