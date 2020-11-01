qx.Class.define("omna.form.field.net.EMailField", {
  extend: qx.ui.form.TextField,
  include: omna.form.field.util.MSetProperties,

  statics: {
    cellRendererClass: omna.table.cellrenderer.String,
    validatorClass: omna.form.validator.net.EMailField
  },

  properties: {
    filter: {
      refine: true,
      init: new RegExp('[0-9a-zA-Z\\.\\_\\@]')
    }
  }
});
