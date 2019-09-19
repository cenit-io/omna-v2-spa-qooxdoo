/**
 * @ignore(Map)
 */
qx.Class.define("omna.table.cellrenderer.Nomenclature", {
    extend: omna.table.cellrenderer.Request,

    members: {
        // override
        getRequest: function (cellInfo) {
            return new omna.request.Nomenclatures(true);
        }
    }
});
