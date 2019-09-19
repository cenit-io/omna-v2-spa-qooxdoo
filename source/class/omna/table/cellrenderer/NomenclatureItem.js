qx.Class.define("omna.table.cellrenderer.NomenclatureItem", {
    extend: omna.table.cellrenderer.Request,

    members: {
        // override
        getRequest: function (cellInfo) {
            return new omna.request.NomenclatureItems(true);
        }
    }
});
