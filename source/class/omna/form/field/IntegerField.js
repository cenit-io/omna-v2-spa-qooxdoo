qx.Class.define("omna.form.field.IntegerField", {
  extend: omna.form.field.NumberField,

  statics: {
    cellRendererClass: omna.table.cellrenderer.Number,

    parseValue: function (value) {
      let n = new Number(value);
      return n.valueOf();
    }
  },

  properties: {
    /** The value of the spinner. */
    value: {
      refine: true,
      init: ""
    },

    minimum: {
      refine: true,
      init: Number.MIN_SAFE_INTEGER
    },

    maximum: {
      refine: true,
      init: Number.MAX_SAFE_INTEGER
    }
  },

  members: {}
});