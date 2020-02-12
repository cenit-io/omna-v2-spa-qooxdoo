/**
 * @childControl form {omna.form.product.DetailsGeneral}.
 */
qx.Class.define('omna.management.product.DetailsGeneral', {
    extend: qx.ui.tabview.Page,
    include: [omna.mixin.MI18n, omna.mixin.MLogo, omna.mixin.MWithManagement],

    construct: function (management) {
        this.set({
            management: management,
            appearance: 'tabview-page',
            layout: new qx.ui.layout.VBox()
        });

        this.base(arguments, this.i18nTrans('general'), this.integrationLogo('omna_v2'));

        var form = this.getChildControl('form');

        form.addListener('save', this.__onSaveGeneral, this);
    },

    members: {
        // overridden
        _createChildControlImpl: function (id, hash) {
            var control;

            switch ( id ) {
                case 'form':
                    control = new omna.form.product.DetailsGeneral();
                    this._renderer = new omna.form.renderer.Quad(control);
                    this.add(this._renderer, { flex: 1 });
                    break;
            }

            return control || this.base(arguments, id);
        },

        __onSaveGeneral: function (e) {
            var request = this.getRequestManagement(),
                product = this.getManagement().getCustomData().item,
                data = e.getData();

            this.emitMessaging('enabled-toolbar', false);
            this.setEnabled(false);

            request.update(product.id, data, function (response) {
                if (response.successful) this.emitMessaging('execute-reload', null, 'Products');

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