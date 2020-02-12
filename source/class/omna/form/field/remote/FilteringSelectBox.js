qx.Class.define('omna.form.field.remote.FilteringSelectBox', {
    extend: omna.form.field.util.AbstractSelectBox,

    statics: {
        cellRendererClass: omna.table.cellrenderer.String
    },

    properties: {
        serviceBasePath: {
            check: 'String'
        },

        labelAttr: {
            check: 'String',
            init: 'name'
        },

        valueAttr: {
            check: 'String',
            init: 'id'
        }
    },

    members: {
        __searchText: null,

        // overridden
        _createChildControlImpl: function (id, hash) {
            var control;

            switch ( id ) {
                case "searchTextField":
                    control = new omna.form.field.util.SearchTextField().set({ focusable: false });
                    control.addListener("changeValue", this._loadItems, this);
                    break;
                case "popup":
                    var searchTextField = this.getChildControl("searchTextField");

                    control = new qx.ui.popup.Popup(new qx.ui.layout.VBox());
                    control.setAutoHide(false);
                    control.setKeepActive(true);
                    control.add(searchTextField);
                    control.add(this.getChildControl("list"));

                    control.addListener("changeVisibility", this._onPopupChangeVisibility, this);

                    break;
            }

            return control || this.base(arguments, id);
        },

        _loadItems: function () {
            var searchText = this.getChildControl("searchTextField").getValue();

            if (this.__searchText === searchText) return;

            this.__searchText = searchText;

            var request = new omna.request.Customs(this.getServiceBasePath(), true),
                labelAttr = this.getLabelAttr(),
                valueAttr = this.getValueAttr(),
                params = { term: searchText };

            request.findRange(0, 25, null, params, function (response) {
                this.removeAll();

                if (response.successful) {
                    response.data.forEach(function (item) {
                        this.add(new qx.ui.form.ListItem(item[labelAttr], this._getIcon(item), item[valueAttr]));
                    }, this);
                } else {
                    q.messaging.emit('Application', 'error', omna.I18n.trans('Messages', 'FAILED-LOAD'));
                }
            }, this);
        },

        _getIcon: function(item){
            return null
        },

        _getItems: function () {
            this._loadItems();
            return this.base(arguments);
        },

        _onBlur: function (e) {
        }
    }
});