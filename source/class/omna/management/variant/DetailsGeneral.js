/**
 * @childControl general-form {omna.form.renderer.Quad}.
 */
qx.Class.define('omna.management.variant.DetailsGeneral', {
    extend: qx.ui.tabview.Page,
    include: [omna.mixin.MI18n, omna.mixin.MLogo, omna.mixin.MWithManagement],

    construct: function (management) {
        this.set({
            management: management,
            appearance: 'tabview-page',
            layout: new qx.ui.layout.VBox()
        });

        this.base(arguments, this.i18nTrans('general'), this.integrationLogo('omna_v2'));

        this._createChildControl('general-form');
    },

    members: {
        _form: null,

        setData: function (data, redefineResetter) {
            this._form.setData(data, redefineResetter)
        },

        // overridden
        _createChildControlImpl: function (id, hash) {
            var control;

            switch ( id ) {
                case 'general-form':
                    this._form = new omna.form.variant.DetailsGeneral();
                    this._form.addListener('save', this.__onSave, this);

                    control = new omna.form.renderer.Quad(this._form);
                    this.add(control, { flex: 1 });
                    break;
            }

            return control || this.base(arguments, id);
        },

        __onSave: function (e) {
            var request = this.getRequestManagement(),
                variant = this.getManagement().getCustomData().item,
                data = e.getData();

            this.emitMessaging('enabled-toolbar', false);
            this.setEnabled(false);

            request.update(variant.id, data, function (response) {
                this.setEnabled(true);
                this.emitMessaging('enabled-toolbar', true);
                if (response.successful) {
                    this.emitMessaging('execute-reload', null, 'VariantsDetails');
                    this.emitMessaging('execute-reload', null, 'Variants');
                }
            }, this);
        }
    },

    destruct: function () {
        this._form.removeListener("save", this.__onSave, this);
        this._form.dispose();
    }
});