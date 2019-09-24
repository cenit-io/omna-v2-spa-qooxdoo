/**
 * @childControl textfield {qx.ui.form.TextField} textfield component of the combobox
 * @childControl list {qx.ui.form.List} list inside the popup
 */
qx.Class.define("omna.form.field.remote.FilteringSelectBox", {
    extend: qx.ui.form.AbstractSelectBox,
    include: [omna.form.field.util.MSetProperties],
    implement: [qx.ui.form.IStringForm],

    statics: {
        cellRendererClass: omna.table.cellrenderer.String
    },

    construct: function () {
        this.base(arguments);

        var textField = this._createChildControl("textfield");

        this.addListener("tap", this._onTap);

        // forward the focusin and focusout events to the textfield. The textfield
        // is not focusable so the events need to be forwarded manually.
        this.addListener("focusin", function (e) {
            textField.fireNonBubblingEvent("focusin", qx.event.type.Focus);
        }, this);

        this.addListener("focusout", function (e) {
            textField.fireNonBubblingEvent("focusout", qx.event.type.Focus);
        }, this);
    },

    events: {
        /** Whenever the value is changed this event is fired
         *
         *  Event data: The new text value of the field.
         */
        "changeValue": "qx.event.type.Data"
    },

    properties: {
        // overridden
        appearance: {
            refine: true,
            init: "widget"
        },

        placeholder: {
            check: "String",
            nullable: true,
            apply: "_applyPlaceholder"
        },

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
        __value: null,
        __oldValue: null,
        __preSelectedItem: null,
        __onInputId: null,

        // overridden
        /**
         * @lint ignoreReferenceField(_forwardStates)
         */
        _forwardStates: {
            focused: true,
            invalid: true
        },

        // property apply
        _applyPlaceholder: function (value, old) {
            this.getChildControl("textfield").setPlaceholder(value);
        },

        // overridden
        _createChildControlImpl: function (id, hash) {
            var control;

            switch ( id ) {
                case "textfield":
                    control = new omna.form.field.util.SearchTextField().set({
                        appearance: 'filter-text-field',
                        focusable: false
                    });
                    control.addState("inner");
                    control.addListener("changeValue", this._onTextFieldChangeValue, this);
                    control.addListener("blur", this.close, this);
                    this._add(control, { flex: 1 });
                    break;

                case "list":
                    // Get the list from the AbstractSelectBox
                    control = this.base(arguments, id);

                    // Change selection mode
                    control.setSelectionMode("single");
                    break;
            }

            return control || this.base(arguments, id);
        },

        // overridden
        tabFocus: function () {
            var field = this.getChildControl("textfield");

            field.getFocusElement().focus();
            field.selectAllText();
        },

        // overridden
        focus: function () {
            this.base(arguments);
            this.getChildControl("textfield").getFocusElement().focus();
        },

        // interface implementation
        setValue: function (value) {
            var textfield = this.getChildControl("textfield"),
                oldValue, label;

            if (value != this.__value) {
                if (value === null) {
                    value = { label: null, value: null };
                } else if (typeof value != 'object') {
                    return this.findItem(value);
                }

                label = value.getLabel ? value.getLabel() : value[this.getLabelAttr()];
                value = value.getModel ? value.getModel() : value[this.getValueAttr()];

                oldValue = this.__value;
                textfield.setValue(label);
                this.__value = value;

                // Fire event
                this.fireDataEvent("changeValue", value, oldValue);
            }
        },

        // interface implementation
        getValue: function () {
            return this.__value;
        },

        // interface implementation
        resetValue: function () {
            this.setValue(this.__oldValue);
        },

        findItem: function (value) {
            var request = new omna.request.Customs(this.getServiceBasePath(), true);

            request.find(value, function (response) {
                if (response.successful) {
                    this.setValue(response.data);
                } else {
                    q.messaging.emit('Application', 'error', this.i18nTrans('Messages', 'FAILED-LOAD'));
                }
            }, this);
        },

        filterItems: function (value) {
            var request = new omna.request.Customs(this.getServiceBasePath(), false),
                labelAttr = this.getLabelAttr(),
                valueAttr = this.getValueAttr(),
                params = { term: value };

            request.findRange(0, 10, null, params, function (response) {
                this.removeAll();

                if (response.successful) {
                    response.data.forEach(function (item) {
                        this.add(new qx.ui.form.ListItem(item[labelAttr], null, item[valueAttr]));
                    }, this);
                    if (response.data.length) {
                        this.open();
                    } else {
                        this.close();
                    }
                } else {
                    q.messaging.emit('Application', 'error', this.i18nTrans('Messages', 'FAILED-LOAD'));
                }
            }, this);
        },

        // override
        _setPreselectedItem: function () {
            if (this.__preSelectedItem) {
                this.setValue(this.__preSelectedItem);
                this.__preSelectedItem = null;
            }
        },

        // overridden
        _onKeyPress: function (e) {
            var visible = this.getChildControl("popup").isVisible(),
                iden = e.getKeyIdentifier();

            if (iden == "Escape") {
                this.close();
                this.resetValue();
            } else if (visible) {
                if (iden == "Down" && e.isAltPressed()) {
                    this.getChildControl("button").addState("selected");
                    this.toggle();
                    e.stopPropagation();
                }
                else if (iden == "Enter") {
                    this._setPreselectedItem();
                    this.close();
                    e.stop();
                } else {
                    this.base(arguments, e);
                }
            }
        },

        /**
         * Toggles the popup's visibility.
         *
         * @param e {qx.event.type.Pointer} Pointer tap event
         */
        _onTap: function (e) {
            this.close();
        },

        // overridden
        _onListPointerDown: function (e) {
            if (this.__preSelectedItem) {
                this.setValue(this.__preSelectedItem);
                this.__preSelectedItem = null;
            }
            this.close();
        },

        // overridden
        _onTextFieldChangeValue: function (e) {
            if (this.__value !== null) {
                this.__oldValue = this.__value;
                this.__value = null;
            }

            this.filterItems(e.getData());
        },

        // overridden
        _onListChangeSelection: function (e) {
            var current = e.getData();
            if (current.length > 0) {
                var popup = this.getChildControl("popup"),
                    context = this.getChildControl("list").getSelectionContext();

                if (popup.isVisible() && (context == "quick" || context == "key")) {
                    this.__preSelectedItem = current[0];
                } else {
                    this.setValue(current[0]);
                    this.__preSelectedItem = null;
                }
            }
        }
    }
});
