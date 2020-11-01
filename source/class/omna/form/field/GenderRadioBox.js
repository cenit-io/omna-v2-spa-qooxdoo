qx.Class.define("omna.form.field.GenderRadioBox", {
  extend: omna.form.field.util.AbstractSwitchRadioBox,

  statics: {
    cellRendererClass: omna.table.cellrenderer.String
  },

  construct: function () {
    this.base(arguments, 'M', 'F');
  },

  properties: {
    value: {
      check: ['M', 'F'],
      event: 'changeValue',
      apply: '_applyValue',
      transform: '_transformValue'
    },

    mLabel: {
      check: 'String',
      init: 'Common.Labels.Male'
    },

    fLabel: {
      check: 'String',
      init: 'Common.Labels.Female'
    }
  }
});