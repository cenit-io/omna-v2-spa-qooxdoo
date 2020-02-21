/**
 * @childControl form {omna.form.product.DetailsProperties}.
 */
qx.Class.define('omna.management.product.DetailsProperties', {
    extend: qx.ui.tabview.Page,
    include: [omna.mixin.MI18n, omna.mixin.MLogo, omna.mixin.MWithManagement],

    construct: function (management, integration) {
        this.set({
            management: management,
            integration: integration,
            appearance: 'tabview-page',
            layout: new qx.ui.layout.VBox()
        });

        this.base(arguments, integration.name, this.integrationLogo(integration.channel));
        this.set({ layout: new qx.ui.layout.VBox(), appearance: 'tabview-page' });

        var form = this.getChildControl('form');

        form.setData(integration.product.properties, true);

        form.addListener('save', this.__onSaveGeneral, this);
    },

    properties: {
        integration: {
            check: 'Object'
        }
    },

    members: {
        // overridden
        _createChildControlImpl: function (id, hash) {
            var control;

            switch ( id ) {
                case 'form':
                    control = new omna.form.product.DetailsProperties(this.getIntegration());
                    this._renderer = new omna.form.renderer.Quad(control);
                    this.add(this._renderer, { flex: 1 });
                    break;
            }

            return control || this.base(arguments, id);
        },

        __onSaveGeneral: function (e) {
            var request = this.getRequestManagement(),
                integration = this.getIntegration(),
                product = integration.product,
                data = e.getData(),
                properties = [];

            product.properties.forEach(function (property) {
                properties.push({ id: property.id, value: data[property.id] })
            });

            this.emitMessaging('enabled-toolbar', false);
            this.setEnabled(false);

            request.updateProperties(integration.id, product.remote_product_id, properties, function (response) {
                if (response.successful) {
                    this.emitMessaging('execute-reload', null, 'ProductsDetails');
                    this.emitMessaging('execute-reload', null, 'Products');
                }

                this.setEnabled(true);
                this.emitMessaging('enabled-toolbar', true);
            }, this);
        }
    },

    destruct: function () {
        this._renderer.dispose();
        this._releaseChildControl('form').dispose();
    }
});