qx.Class.define("omna.form.field.ListItem", {
  extend: qx.ui.form.ListItem,

  members: {
    // property apply
    _applyIcon: function (value, old) {
      this.base(arguments, value, old);

      let icon = this.getChildControl("icon", true);
      if (icon) icon.set({ maxWidth: 24, maxHeight: 24 });
    },
  }
});