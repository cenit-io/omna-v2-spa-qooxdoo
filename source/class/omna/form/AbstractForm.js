/**
 * @asset(omna/icon/16/actions/save.png)
 * @asset(omna/icon/16/actions/clear.png)
 */
qx.Class.define("omna.form.AbstractForm", {
    type: "abstract",
    extend: qx.ui.form.Form,
    include: [omna.mixin.MI18n],
    implement: [omna.mixin.II18n],

    /**
     * Constructor
     */
    construct: function () {
        this.base(arguments);

        // Create fields.
        this.__createFormFields();

        // Create buttons actions
        this.__createButtons();
    },

    events: {
        save: 'qx.event.type.Data'
    },

    properties: {},

    members: {
        getData: function () {
            var name, items = this.getItems(), data = {};

            for (name in items) if (items[name].isEnabled()) data[name] = this._getItemValue(items[name]);

            return data;
        },

        setData: function (data, redefineResetter) {
            var items = this.getItems(), name;

            for (name in items) this._setItemValue(items[name], data[name]);

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
        },

        __createButtons: function () {
            var bS = new qx.ui.form.Button(this.i18nTrans("save"), "omna/icon/16/actions/save.png"),
                bR = new qx.ui.form.Button(this.i18nTrans("reset"), "omna/icon/16/actions/clear.png"),
                manager = this.getValidationManager();

            bS.setAllowStretchX(true);
            bR.setAllowStretchX(true);

            this.addButton(bS);
            this.addButton(bR);

            bS.addListener("execute", function () {
                bS.setLabel(this.i18nTrans("validating"));
                manager.validate();
            }, this);

            bR.addListener("execute", function () {
                this.reset();
            }, this);

            manager.addListener("complete", function () {
                bS.setLabel(this.i18nTrans("sending"));
                if (manager.getValid()) this.fireDataEvent('save', this.getData());
                bS.setLabel(this.i18nTrans("save"));
            }, this);
        },

        getI18nCatalog: function () {
            return 'Common'
        }
    }
});
