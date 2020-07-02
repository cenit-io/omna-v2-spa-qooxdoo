qx.Class.define("omna.form.product.DetailsProperties", {
    extend: omna.form.AbstractForm,

    statics: {
        itemAttr: 'product'
    },

    construct: function (integration) {
        this.setIntegration(integration);
        this.base(arguments);
        this.setData(this.getProperties(), true)
    },

    properties: {
        integration: {
            check: 'Object'
        }
    },

    members: {
        _createFormFields: function () {
            let widget;

            this.getProperties().forEach(function (property) {
                if (property.start_section) this.addGroupHeader(property.start_section);
                widget = this.__createPropertyField(property);
                this.add(widget, property.label, null, property.id, this, { colSpan: this.__getColSpan(property) });
            }, this);
        },

        __getColSpan: function (property) {
            let types = /^(rich_text|data_grid)$/,
                ids = /^(category_id)$/;

            if (property.input_type.match(types) || String(property.id).match(ids)) return 4;

            return 1;
        },

        __createPropertyField: function (property) {
            let widget;

            switch ( property.input_type ) {
                case 'single_select':
                    widget = new omna.form.field.LocalSelectBox();
                    widget.setOptions(property.options);
                    break;
                case 'boolean':
                    widget = new omna.form.field.boolean.SelectBox();
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
                case 'date':
                    widget = new omna.form.field.calendar.DateField();
                    widget.setStrDateFormat('YYYY-MM-dd');
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
            let data = {};

            properties.forEach((property) => data[property.id] = this.__parsePropertyValue(property), this);

            return this.base(arguments, data, redefineResetter);
        },

        getItem: function () {
            return this.getIntegration()[this.constructor.itemAttr];
        },

        getProperties: function () {
            return this.getItem().properties || [];
        },

        getI18nCatalog: function () {
            return 'Products'
        }
    },

    destruct: function () {
        //TODO: DESTRUCT
    }
});