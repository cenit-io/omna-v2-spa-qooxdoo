qx.Class.define("omna.form.field.EnumSelectBox", {
  extend: omna.form.field.MultiSelectBox,

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

  }
});