qx.Class.define("omna.form.dialog.GridGallery", {
  extend: omna.form.dialog.AbstractField,

  // override
  construct: function () {
    this.base(arguments, this.i18nTrans('gallery') + ':');
  },

  members: {
    _createFormFields: function (form) {
      this.base(arguments);
    }
  }
});