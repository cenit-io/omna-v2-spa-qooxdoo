/**
 * @childControl notifications {qx.ui.container.Composite}.
 * @childControl form {omna.form.product.DetailsProperties}.
 *
 * @asset(omna/icon/32/info.png)
 * @asset(omna/icon/32/good.png)
 * @asset(omna/icon/32/warn.png)
 * @asset(omna/icon/32/error.png)
 * @asset(omna/icon/32/notice.png)
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

        // Create route handler for messaging channels.
        q.messaging.on("Application", /^(info|good|notice|warn|error)$/, this.onNotify, this);

        this.base(arguments, integration.name, this.integrationLogo(integration.channel));
        this.set({ layout: new qx.ui.layout.VBox(), appearance: 'tabview-page' });

        this._createChildControl('notifications');

        if (integration.product.errors) q.messaging.emit('Application', 'error', integration.product.errors, this);

        if (integration.product.properties.length > 0) {
            var form = this.getChildControl('form');

            form.setData(integration.product.properties, true);

            form.addListener('save', this.__onSaveGeneral, this);
        }
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
                case 'notifications':
                    control = new qx.ui.container.Composite(new qx.ui.layout.VBox(5));
                    this.add(control, { flex: 0 });
                    break;
                case 'form':
                    control = new omna.form.product.DetailsProperties(this.getIntegration());
                    this._renderer = new omna.form.renderer.Quad(control);
                    this.add(this._renderer, { flex: 1 });
                    break;
            }

            return control || this.base(arguments, id);
        },

        _notify: function (msg, type) {
            var notifications = this.getChildControl('notifications');

            notifications.add(
                new qx.ui.basic.Atom(msg, 'omna/icon/32/' + type + '.png').set({
                    decorator: "tooltip",
                    iconPosition: "left",
                    backgroundColor: type,
                    textColor: type === 'error' ? 'white' : 'black',
                    padding: 5
                })
            );
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
        },

        onNotify: function (data) {
            if (data.customData === this) this._notify(data.params, data.path);
        }
    },

    destruct: function () {
        this._renderer && this._renderer.dispose();
        this._releaseChildControl('form').dispose();
    }
});