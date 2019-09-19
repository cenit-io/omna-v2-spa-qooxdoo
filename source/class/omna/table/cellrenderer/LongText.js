qx.Class.define("omna.table.cellrenderer.LongText", {
    extend: qx.ui.table.cellrenderer.Default,

    members: {
        // overridden
        _getContentHtml: function (cellInfo) {
            if (cellInfo.value) {
                return qx.bom.Template.render('<span style="cursor: pointer;" title="{{value}}">{{value}}</span>', cellInfo);
            }

            return "";
        }
    }
});
