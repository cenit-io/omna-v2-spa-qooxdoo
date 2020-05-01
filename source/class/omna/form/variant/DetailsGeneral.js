qx.Class.define("omna.form.variant.DetailsGeneral", {
    extend: omna.form.AbstractForm,

    members: {
        __createFormFields: function () {
            let widget;

            widget = new omna.form.field.TextField();
            widget.set({ required: true });
            this._add(widget, 'sku', 4);

            widget = new omna.form.field.NumberField();
            widget.set({ required: true, minimum: 0, maximumFractionDigits: 0 });
            this._add(widget, 'quantity', 1);

            widget = new omna.form.field.NumberField();
            widget.set({ required: true, minimum: 0, maximumFractionDigits: 2, prefix: '$' });
            this._add(widget, 'price', 1);

            widget = new omna.form.field.NumberField();
            widget.set({ required: true, minimum: 0, maximumFractionDigits: 2, prefix: '$' });
            this._add(widget, 'original_price', 1);

            this.addGroupHeader(this.i18nTrans('package'));

            this._createPackageNumberField('package.weight', ' kg')
            this._createPackageNumberField('package.height', ' cm');
            this._createPackageNumberField('package.length', ' cm');
            this._createPackageNumberField('package.width', ' cm');

            widget = new omna.form.field.TextArea();
            widget.set({ required: false });

            this._add(widget, 'package.content', 4);
        },

        _createPackageNumberField: function (name, postfix) {
            let widget = new omna.form.field.NumberField().set({
                required: false,
                minimum: 0,
                maximumFractionDigits: 2,
                postfix: postfix
            });

            this._add(widget, name, 1);
        },

        _add: function (item, name, colSpan, validator) {
            this.add(item, this.i18nTrans(name), validator, name, this, { colSpan: colSpan })
        },

        getI18nCatalog: function () {
            return 'Variants'
        }
    },

    destruct: function () {
        //TODO: DESTRUCT
    }
});