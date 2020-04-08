qx.Class.define("omna.form.dialog.Custom", {
    extend: omna.form.dialog.AbstractForm,
    include: [omna.mixin.MWithManagement],

    /**
     * Constructor
     *
     * @param management {omna.management.AbstractManagement}
     * @param action {String} Action id: ('add' or 'edit') value.
     * @param caption {String} The caption text.
     * @param icon {String} The URL of the caption bar icon.
     */
    construct: function (management, action, caption, icon) {
        var settings = management.getSettings();

        this.set({
            management: management,
            width: settings.formWidth,
            action: action
        });

        this.base(arguments, caption, icon);
        // this.addListener("close", this.destroy);
    },

    properties: {
        action: {
            check: 'String'
        }
    },

    members: {
        _createFormFields: function (form) {
            var management = this.getManagement(),
                fields = management.getFields(),
                accessFormActionProperty = (this.getAction() == 'add') ? 'accessInAddForm' : 'accessInEditForm';

            fields.forEach(function (field) {
                var accessFormAction = field[accessFormActionProperty] || 'N',
                    widget,
                    widgetClass,
                    validator = null,
                    validatorClass,
                    label;

                if (accessFormAction !== 'N' && field.widgetClass) {
                    widgetClass = qx.Class.getByName(field.widgetClass);

                    if (widgetClass) {
                        widget = new widgetClass();
                        widget.setSettings ? widget.setSettings(field) : widget.__settings = field;
                        widget.setWidth && widget.setWidth(Math.floor(this.getWidth() * 67 / 100));
                        widget.setFromJSON(field);

                        if (accessFormAction === 'H') {
                            widget.setVisibility("excluded");
                        } else if (accessFormAction === 'R') {
                            // TODO: set property readOnly for all field type.
                            // Los campos con propiedad readOnly=true no son modificables pero si se incluyen
                            // en el getData del formulario. A diferencia de los enabled=false que no son
                            // modificables ni se incluyen en el getData del formulario.
                            widget.setReadOnly && widget.setReadOnly(true) || widget.setVisibility("excluded");
                        }

                        if (field.validatorClass) {
                            validatorClass = qx.Class.getByName(field.validatorClass);
                            if (!validatorClass) {
                                q.messaging.emit("Application", "error", this.tr("Class no found: '%1'.", field.validatorClass));
                            } else {
                                validator = new validatorClass();
                            }
                        } else {
                            validator = widgetClass.validatorClass ? new widgetClass.validatorClass : null;
                        }

                        label = this.i18nTrans(field.label || field.name);
                        form.add(widget, label, validator, field.customModelName || field.name, form);

                    } else {
                        q.messaging.emit("Application", "error", this.tr("Class no found: '%1'.", field.widgetClass));
                    }
                }
            }, this);

            this.initializeItems();
        }
    }
});