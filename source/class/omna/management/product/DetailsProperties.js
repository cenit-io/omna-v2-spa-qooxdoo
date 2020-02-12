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
                product = this.getManagement().getCustomData().item,
                integration = this.getIntegration(),
                data = e.getData();

            console.log(product, integration, data);
        }
    },

    destruct: function () {
        this._renderer.dispose();
        this._releaseChildControl('form').dispose();
    }
});