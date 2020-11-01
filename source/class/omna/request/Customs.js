qx.Class.define("omna.request.Customs", {
  extend: omna.request.AbstractResource,

  construct: function (serviceBasePath, sync) {
    this.base(arguments, serviceBasePath, sync);
  }
});
