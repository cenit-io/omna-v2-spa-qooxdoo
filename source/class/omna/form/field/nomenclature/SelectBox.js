qx.Class.define("omna.form.field.nomenclature.SelectBox", {
    extend: omna.form.field.util.AbstractSelectBox,

    statics: {
        cellRendererClass: omna.table.cellrenderer.Nomenclature
    },

    construct: function () {
        this.base(arguments);

        var request = new omna.request.Nomenclatures(true);
        request.findAll('name', null, function (response) {
            if (response.successful) {
                response.data.forEach(function (item) {
                    this.add(new qx.ui.form.ListItem(item.name, null, item.id));
                }, this);
            } else {
                var msg = this.i18nTrans('Messages', 'FAILED-LOAD');
                q.messaging.emit('Application', 'error', msg);
            }
        }, this);
    }
});