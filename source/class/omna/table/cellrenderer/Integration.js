qx.Class.define("omna.table.cellrenderer.Integration", {
    extend: qx.ui.table.cellrenderer.Replace,

    // overridden
    construct: function () {
        this.base(arguments);
        this.setReplaceFunction(this._replaceIntregration)
    },

    members: {
        // overridden
        _replaceIntregration: function (cellInfo) {
            return cellInfo ? qx.bom.Template.render('{{name}} of {{channel}}', cellInfo) : null;
        }
    }
});