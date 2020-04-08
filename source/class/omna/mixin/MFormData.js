qx.Mixin.define('omna.mixin.MFormData', {
    members: {
        getForm: function () {
            return this instanceof qx.ui.form.Form ? this : this._form
        },

        initializeItems: function () {
            let name, items = this.getForm().getItems();

            for (name in items) items[name].initialize && items[name].initialize();
        },

        getData: function () {
            let items = this.getForm().getItems(),
                name, data = {},

                _setModel = (attr, value, model) => {
                    let m = attr.match(/^([^\.]+)\.(.*)$/);

                    if (!m) return model[attr] = value;

                    model[m[1]] = model[m[1]] || {};
                    _setModel(m[2], value, model[m[1]]);
                };

            for (name in items) if (items[name].isEnabled()) _setModel(name, this._getItemValue(items[name]), data);

            return data;
        },

        setData: function (data, redefineResetter) {
            let items = this.getForm().getItems(),
                name, model, settings,

                _getModel = (attr, model) => {
                    let m = attr.match(/^([^\.]+)\.(.*)$/);

                    if (!m) return model[attr];

                    return _getModel(m[2], model[m[1]] || {});
                };

            for (name in items) {
                model = _getModel(name, data);

                if (model === undefined) {
                    settings = items[name].getSettings ? items[name].getSettings() : items[name].__settings;
                    model = settings ? _getModel(settings.name, data) : model
                }

                this._setItemValue(items[name], model);
            }

            redefineResetter && this.redefineResetter();

            return this;
        },

        _getItemValue: function (item) {
            if (qx.Class.hasInterface(item.constructor, qx.ui.core.IMultiSelection)) {
                return item.getModelSelection().toArray();
            } else if (qx.Class.hasInterface(item.constructor, qx.ui.core.ISingleSelection)) {
                return item.getModelSelection().getItem(0) || null;
            } else {
                return item.getValue();
            }
        },

        _setItemValue: function (item, value) {
            if (value === undefined) value = null;

            if (qx.Class.hasInterface(item.constructor, qx.ui.core.IMultiSelection)) {
                return item.setModelSelection(value);
            } else if (qx.Class.hasInterface(item.constructor, qx.ui.core.ISingleSelection)) {
                return item.setModelSelection([value]);
            } else {
                return item.setValue(value);
            }
        }
    }
});
