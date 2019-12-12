qx.Class.define("omna.form.dialog.AbstractForm", {
    type: "abstract",
    extend: omna.dialog.AbstractDialog,

    members: {
        _form: null,

        _createContent: function () {
            // Create form login
            this._form = new qx.ui.form.Form();

            // Create form fields
            this._createFormFields(this._form);

            // Add from renderer
            this._createRenderer();
        },

        _createRenderer: function () {
            var renderer = new omna.form.renderer.SingleWithOptionalLabel(this._form);

            this.add(renderer, { flex: 1 });
        },

        _createButtons: function () {
            this._createAcceptOrCancelButton();
        },

        _createAcceptOrCancelButton: function () {
            var bA = new qx.ui.form.Button(this.tr("Accept"), "icon/16/actions/dialog-apply.png"),
                bC = new qx.ui.form.Button(this.tr("Cancel"), "icon/16/actions/dialog-cancel.png"),
                manager = this._form.getValidationManager();

            bA.setAllowStretchX(true);
            bC.setAllowStretchX(true);
            this._form.addButton(bA);
            this._form.addButton(bC);

            bA.addListener("execute", function () {
                bA.setLabel(this.tr("Validating..."));
                manager.validate();
            }, this);

            bC.addListener("execute", function () {
                this.fireEvent('cancel', qx.event.type.Event, null);
                this.close();
            }, this);

            this.addListener("appear", function () {
                bC.focus();
            }, this);

            manager.addListener("complete", function () {
                bA.setLabel(this.tr("Sending"));
                if (manager.getValid()) this.fireDataEvent('accept', this.getData());
                bA.setLabel(this.tr("Accept"));
            }, this);
        },

        redefineResetter: function () {
            this._form.redefineResetter();
        },

        reset: function () {
            this._form.reset();
            return this;
        },

        initializeItems: function () {
            var name, items = this._form.getItems();

            for (name in items) items[name].initialize && items[name].initialize();
        },

        getData: function () {
            var name, items = this._form.getItems(), data = {};

            for (name in items) if (items[name].isEnabled()) data[name] = this._getItemValue(items[name])

            return data;
        },

        setData: function (data, redefineResetter) {
            var items = this._form.getItems(), name;

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
        }
    },

    destruct: function () {
        if (!this._form.isDisposed()) {

            var name, items = this._form.getItems();

            for (name in items) items[name].destroy();

            this._form.getButtons().forEach(function (item) {
                item.destroy();
            });
        }

        this.getChildren().forEach(function (item) {
            item.destroy();
        });
    }
});
