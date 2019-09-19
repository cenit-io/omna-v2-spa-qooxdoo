qx.Class.define("omna.form.field.remote.SelectBox", {
    extend: omna.form.field.util.AbstractSelectBox,

    statics: {
        cellRendererClass: omna.table.cellrenderer.String
    },

    properties: {
        serviceBasePath: {
            check: 'String',
            apply: '_applyServiceBasePath'
        },

        valueAttr: {
            check: 'String',
            init: 'id'
        },

        labelAttr: {
            check: 'String',
            init: 'title'
        }
    },

    members: {
        _applyServiceBasePath: function (url) {
            var request = new omna.request.Customs(url, true);

            request.findAll(this.getLabelAttr(), null, function (response) {
                if (response.successful) {
                    response.data.forEach(function (item) {
                        this.add(new qx.ui.form.ListItem(item[this.getLabelAttr()], null, item[this.getValueAttr()]));
                    }, this);
                } else {
                    q.messaging.emit('Application', 'error', this.i18nTrans('Messages', 'FAILED-LOAD'));
                }
            }, this);
        },

        _setItems: function (items) {
            items.forEach(function (item) {
                this.add(new qx.ui.form.ListItem(item[this.getLabelAttr()], null, item[this.getValueAttr()]));
            }, this);
        },

        _loadItems: function () {

        }
    }
});