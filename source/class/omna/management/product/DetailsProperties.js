/**
 * @childControl notifications {qx.ui.container.Composite}.
 * @childControl properties-form {omna.form.renderer.Quad}.
 */
qx.Class.define('omna.management.product.DetailsProperties', {
    extend: qx.ui.tabview.Page,
    include: [omna.mixin.MI18n, omna.mixin.MLogo, omna.mixin.MWithManagement],

    statics: {
        detailsPropertiesClass: omna.form.product.DetailsProperties,
        managementId: 'ProductsDetails',
        itemAttr: 'product'
    },

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

        let item = this._getItem();

        if (item.errors) q.messaging.emit('Application', 'error', item.errors, this);
        if (item.properties && item.properties.length > 0) this._createChildControl('properties-form');
    },

    properties: {
        integration: {
            check: 'Object'
        }
    },

    members: {
        _form: null,

        _getItem: function () {
            return this.getIntegration()[this.constructor.itemAttr];
        },

        // overridden
        _createChildControlImpl: function (id, hash) {
            let control;

            switch ( id ) {
                case 'notifications':
                    control = new qx.ui.container.Composite(new qx.ui.layout.VBox(5));
                    this.add(control, { flex: 0 });
                    break;
                case 'properties-form':
                    this._form = new this.constructor.detailsPropertiesClass(this.getIntegration());
                    this._form.addListener('save', this.__onSave, this);

                    control = new omna.form.renderer.Quad(this._form);

                    let scroll = new qx.ui.container.Scroll(control);
                    scroll.setContentPadding(5);

                    this.add(scroll, { flex: 1 });
                    break;
            }

            return control || this.base(arguments, id);
        },

        _notify: function (msg, type) {
            let notifications = this.getChildControl('notifications');

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

        __onSave: function (e) {
            let request = this.getRequestManagement(),
                integration = this.getIntegration(),
                data = e.getData(),
                properties = [];

            this._getItem().properties.forEach(function (property) {
                properties.push({ id: property.id, value: data[property.id] })
            });

            this.emitMessaging('enabled-toolbar', false);
            this.setEnabled(false);

            request.updateProperties(integration, properties, function (response) {
                this.setEnabled(true);
                this.emitMessaging('enabled-toolbar', true);
                if (response.successful) this.emitMessaging('execute-reload', null, this.constructor.managementId);
            }, this);
        },

        onNotify: function (data) {
            if (data.customData === this) this._notify(data.params, data.path);
        }
    },

    destruct: function () {
        if (this._form) {
            this._form.removeListener("save", this.__onSave, this);
            this._form.dispose();
        }
    }
});