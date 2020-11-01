qx.Class.define("omna.ui.tabview.TabView", {
  extend: qx.ui.tabview.TabView,

  destruct: function () {
    this.getChildren().forEach(function (item) {
      item.destroy();
    });
  }
});