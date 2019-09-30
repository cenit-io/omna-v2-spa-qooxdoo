qx.Class.define('omna.form.field.remote.FilteringSelectBox', {
    extend: omna.form.field.util.AbstractSelectBox,

    statics: {
        cellRendererClass: omna.table.cellrenderer.String
    },

    construct: function () {
        this.base(arguments);
    },

    properties: {
        serviceBasePath: {
            check: 'String'
        },

        labelAttr: {
            check: 'String',
            init: 'id'
        },

        valueAttr: {
            check: 'String',
            init: 'name'
        }
    },

    members: {
        // overridden
        _createChildControlImpl: function (id, hash) {
            var control;

            switch ( id ) {
                case "searchTextField":
                    control = new omna.form.field.util.SearchTextField().set({ focusable: false });
                    control.addListener("changeValue", this._onSearchTextFieldChangeValue, this);
                    break;
                case "popup":
                    var searchTextField = this.getChildControl("searchTextField");

                    control = new qx.ui.popup.Popup(new qx.ui.layout.VBox());
                    control.setAutoHide(false);
                    control.setKeepActive(true);
                    control.add(searchTextField);
                    control.add(this.getChildControl("list"));

                    control.addListener("changeVisibility", this._onPopupChangeVisibility, this);

                    this._loadItems('');
                    break;
            }

            return control || this.base(arguments, id);
        },

        _loadItems: function (searchText) {
            var request = new omna.request.Customs(this.getServiceBasePath(), false),
                labelAttr = this.getLabelAttr(),
                valueAttr = this.getValueAttr(),
                params = { term: searchText };

            request.findRange(0, 99, null, params, function (response) {
                this.removeAll();

                if (response.successful) {
                    response.data.forEach(function (item) {
                        this.add(new qx.ui.form.ListItem(item[labelAttr], null, item[valueAttr]));
                    }, this);
                } else {
                    q.messaging.emit('Application', 'error', omna.I18n.trans('Messages', 'FAILED-LOAD'));
                }
            }, this);
        },

        _onSearchTextFieldChangeValue: function (e) {
            this._loadItems(e.getData());
        },

        _onBlur: function (e) {
        }
    }
});