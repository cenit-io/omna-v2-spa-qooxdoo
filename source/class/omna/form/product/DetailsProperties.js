qx.Class.define("omna.form.product.DetailsProperties", {
    extend: omna.form.AbstractForm,

    construct: function (integration) {
        this.setIntegration(integration);
        this.base(arguments);
    },

    properties: {
        integration: {
            check: 'Object'
        }
    },

    members: {
        __createFormFields: function () {
            var widget, integration = this.getIntegration();

            integration.product.properties.forEach(function (property) {
                widget = this.__createPropertyField(property, integration);
                this.add(widget, property.label, null, property.id, this, { colSpan: this.__getColSpan(property) });
            }, this);
        },

        __getColSpan: function (property) {
            var widget;

            switch ( property.input_type ) {
                case 'rich_text':
                case 'category_select_box':
                    return 4;
                default:
                    return 1;
            }
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
                case 'category_select_box':
                    widget = new omna.form.field.remote.FilteringSelectBox();
                    widget.setServiceBasePath('/integrations/' + integration.id + '/categories');
                    break;
                default:
                    this.error('UNSUPPORTED_INPUT_TYPE', [property.input_type]);
                    widget = new omna.form.field.TextField();
            }

            widget.set({ required: property.required });

            return widget
        },

        getI18nCatalog: function () {
            return 'Products'
        }
    },

    destruct: function () {
        console.log(123456);
    }
});