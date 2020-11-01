qx.Class.define("omna.form.field.util.AbstractSelectBox", {
  type: 'abstract',
  extend: qx.ui.form.SelectBox,
  include: [
    omna.form.field.util.MSetProperties,
    omna.form.field.util.MReadOnly
  ],

  members: {
    _onKeyPress: function (e) {
      if (!this.isReadOnly()) this.base(arguments, e);
    },

    open: function () {
      if (!this.isReadOnly()) this.base(arguments);
    }
  }
});