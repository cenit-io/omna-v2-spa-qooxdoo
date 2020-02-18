qx.Class.define('omna.form.field.remote.FilteringSelectBox', {
    extend: omna.form.field.util.AbstractSelectBox,

    statics: {
        cellRendererClass: omna.table.cellrenderer.String
    },

    /**
     * Constructor
     */
    construct: function () {
        this.base(arguments);

        this.__requestManagement = new omna.request.Customs('/serviceBasePath', true);
    },

    properties: {
        serviceBasePath: {
            check: 'String',
            apply: '__applyServiceBasePath'
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

        __applyServiceBasePath: function (value) {
            this.__requestManagement.setServiceBasePath(value);
        },

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

            this.__requestManagement.findRange(0, 24, null, { term: searchText }, function (response) {
                this.removeAll();
                if (response.successful) {
                    var labelAttr = this.getLabelAttr(),
                        valueAttr = this.getValueAttr();

                    this.__cache = response.data;

                    response.data.forEach(function (item) {
                        this.add(new qx.ui.form.ListItem(item[labelAttr], this._getIcon(item), item[valueAttr]));
                    }, this);
                } else {
                    q.messaging.emit('Application', 'error', omna.I18n.trans('Messages', 'FAILED-LOAD'));
                }
            }, this);
        },

        _loadItem: function (id) {
            this.__requestManagement.find(id, function (response) {
                if (response.successful) {
                    var labelAttr = this.getLabelAttr(),
                        valueAttr = this.getValueAttr(),
                        item = response.data;

                    this.__cache.unshift(item);
                    this.add(new qx.ui.form.ListItem(item[labelAttr], this._getIcon(item), item[valueAttr]));
                    this.setModelSelection([item[valueAttr]])
                } else {
                    q.messaging.emit('Application', 'error', omna.I18n.trans('Messages', 'FAILED-LOAD'));
                }
            }, this);
        },

        _getCacheItem: function (id) {
            return (this.__cache || []).find(function (item) {
                return item.id == id
            }, this);
        },

        _getIcon: function (item) {
            return null
        },

        _getItems: function () {
            this._loadItems();
            return this.base(arguments);
        },

        setModelSelection: function (value) {
            if (this._getCacheItem(value[0])) {
                this.base(arguments, value);
            } else {
                this._loadItem(value[0]);
            }
        },

        _onBlur: function (e) {
        }
    }
});