qx.Class.define("omna.form.product.DetailsGeneral", {
    extend: omna.form.AbstractForm,

    members: {
        __createFormFields: function () {
            let widget;

            widget = new omna.form.field.TextField();
            widget.set({ required: true });
            this._add(widget, 'name', 3);

            widget = new omna.form.field.NumberField();
            widget.set({ required: true, minimum: 0, maximumFractionDigits: 2, prefix: '$' });
            this._add(widget, 'price', 1);

            widget = new omna.form.field.TextArea();
            widget.set({ required: true, autoSize: true, wrap: false });
            this._add(widget, 'description', 4);

            this.addGroupHeader(this.i18nTrans('package'));

            this._createPackageNumberField('package.weight', ' kg')
            this._createPackageNumberField('package.height', ' cm');
            this._createPackageNumberField('package.length', ' cm');
            this._createPackageNumberField('package.width', ' cm');

            widget = new omna.form.field.TextArea();
            widget.set({ required: false });
            this._add(widget, 'package.content', 3);

            widget = new omna.form.field.LocalSelectBox();
            widget.set({
                required: false,
                allowGrowY: false,
                i18n: 'Products',
                options: [
                    { value: false, label: "not-overwrite-package-in-any-variants" },
                    { value: true, label: "overwrite-package-in-all-variants" }
                ]
            });
            this._add(widget, 'package.overwrite', 1);
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
            return 'Products'
        }
    },

    destruct: function () {
        //TODO: DESTRUCT
    }
});