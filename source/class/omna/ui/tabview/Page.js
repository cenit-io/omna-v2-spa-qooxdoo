qx.Class.define("omna.ui.tabview.Page", {
    extend: qx.ui.tabview.Page,

    destruct: function () {
        this.getChildren().forEach(function (item) {
            item.destroy();
        });
    }
});