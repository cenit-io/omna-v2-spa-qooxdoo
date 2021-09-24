qx.Class.define("omna.form.field.util.AbstractSelectBox", {
  type: 'abstract',
  extend: qx.ui.form.SelectBox,
  include: [
    omna.form.field.util.MSetProperties,
    omna.form.field.util.MReadOnly
  ],

  construct: function () {
    this.base(arguments);

    const atom = this.getChildControl("atom");

    atom.addListener("changeIcon", this._onChangeIcon, this);
  },

  members: {
    _onKeyPress: function (e) {
      if (!this.isReadOnly()) this.base(arguments, e);
    },

    _onChangeIcon: function (e) {
      const icon = this.getChildControl("atom").getChildControl('icon');
      if (icon) icon.set({ maxWidth: 24, maxHeight: 24 });
    },

    open: function () {
      if (!this.isReadOnly()) this.base(arguments);
    }
  }
});