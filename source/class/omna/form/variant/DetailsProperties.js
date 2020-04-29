qx.Class.define("omna.form.variant.DetailsProperties", {
    extend: omna.form.AbstractForm,

    construct: function (integration) {
        this.setIntegration(integration);
        this.base(arguments);
        this.setData(integration.variant.properties, true)
    },

    properties: {
        integration: {
            check: 'Object'
        }
    },

    members: {
        __createFormFields: function () {
            var widget, integration = this.getIntegration();

            integration.variant.properties.forEach(function (property) {
                widget = this.__createPropertyField(property, integration);
                this.add(widget, property.label, null, property.id, this, { colSpan: this.__getColSpan(property) });
            }, this);
        },

        __getColSpan: function (property) {
            var types = /^(rich_text|data_grid)$/,
                ids = /^(category_id)$/;

            if (property.input_type.match(types) || property.id.match(ids)) return 4;

            return 1;
        },

        __createPropertyField: function (property, integration) {
            var widget;

            switch ( property.input_type ) {
                case 'single_select':
                    widget = new omna.form.field.LocalSelectBox();
                    widget.setOptions(property.options);
                    break;
                case 'multi_select':
                    widget = new omna.form.field.MultiSelectBox();
                    widget.setOptions(property.options);
                    break;
                case 'multi_enum_input':
                    this.warn('UNSUPPORTED_INPUT_TYPE', [property.input_type]);
                    widget = new omna.form.field.MultiSelectBox();
                    widget.setOptions(property.options);
                    break;
                case 'enum_input':
                    widget = new omna.form.field.EnumSelectBox();
                    widget.setOptions(property.options);
                    break;
                case 'numeric':
                    widget = new omna.form.field.NumberField();
                    break;
                case 'text':
                    widget = new omna.form.field.TextField();
                    break;
                case 'rich_text':
                    widget = new omna.form.field.TextArea();
                    break;
                case 'data_grid':
                    widget = new omna.form.field.TextArea();
                    break;
                case 'single_select_with_remote_options':
                    widget = new omna.form.field.remote.FilteringSelectBox();
                    widget.setServiceBasePath(property.options_service_path);
                    break;
                default:
                    this.error('UNSUPPORTED_INPUT_TYPE', [property.input_type]);
                    widget = new omna.form.field.TextField();
            }

            widget.set({ required: property.required });

            return widget
        },

        __parsePropertyValue: function (property) {
            switch ( property.input_type ) {
                case 'numeric':
                    return property.value;
                case 'text':
                case 'rich_text':
                    return property.value || '';
                case 'data_grid':
                    return JSON.stringify(property.value);
                default:
                    return property.value;
            }
        },

        setData: function (properties, redefineResetter) {
            var data = {};

            properties.forEach((property) => data[property.id] = this.__parsePropertyValue(property), this);

            return this.base(arguments, data, redefineResetter);
        },

        getI18nCatalog: function () {
            return 'Variants'
        }
    },

    destruct: function () {
        //TODO: DESTRUCT
    }
});