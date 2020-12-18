qx.Class.define('omna.form.field.remote.products.FilteringSelectBox', {
  extend: omna.form.field.remote.FilteringSelectBox,
  include: omna.mixin.MLogo,

  construct: function () {
    this.base(arguments);
    this.set({ serviceBasePath: "products", labelAttr: "name", valueAttr: "id" });
  },

  members: {

  }
});