qx.Class.define("omna.form.product.DetailsGeneral", {
    extend: omna.form.AbstractForm,

    members: {
        __createFormFields: function () {
            var widget, label, field;

            field = 'name';
            widget = new omna.form.field.TextField();
            widget.set({ required: true });
            label = this.i18nTrans(field);
            this.add(widget, label, null, field, this, { colSpan: 3 });

            field = 'price';
            widget = new omna.form.field.NumberField();
            widget.set({ required: true, minimum: 0, maximumFractionDigits: 2, prefix: '$' });
            label = this.i18nTrans(field);
            this.add(widget, label, null, field, this, { colSpan: 1 });

            field = 'description';
            widget = new omna.form.field.TextArea();
            widget.set({ required: true, autoSize: true, wrap: false });
            label = this.i18nTrans(field);
            this.add(widget, label, null, field, this, { colSpan: 4 });

            this.addGroupHeader(this.i18nTrans('package'));

            widget = new omna.form.field.NumberField();
            widget.set({ required: false, minimum: 0, maximumFractionDigits: 2, postfix: ' kg' });
            label = this.i18nTrans('package_weight');
            this.add(widget, label, null, 'package.weight', this, { colSpan: 1 });

            widget = new omna.form.field.NumberField();
            widget.set({ required: false, minimum: 0, maximumFractionDigits: 2, postfix: ' cm' });
            label = this.i18nTrans('package_height');
            this.add(widget, label, null, 'package.height', this, { colSpan: 1 });

            widget = new omna.form.field.NumberField();
            widget.set({ required: false, minimum: 0, maximumFractionDigits: 2, postfix: ' cm' });
            label = this.i18nTrans('package_length');
            this.add(widget, label, null, 'package.length', this, { colSpan: 1 });

            widget = new omna.form.field.NumberField();
            widget.set({ required: false, minimum: 0, maximumFractionDigits: 2, postfix: ' cm' });
            label = this.i18nTrans('package_width');
            this.add(widget, label, null, 'package.width', this, { colSpan: 1 });

            widget = new omna.form.field.TextArea();
            widget.set({ required: false });
            label = this.i18nTrans('package_content');
            this.add(widget, label, null, 'package.content', this, { colSpan: 3 });

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
            label = this.i18nTrans('package_overwrite');
            this.add(widget, label, null, 'package.overwrite', this, { colSpan: 1 });
        },

        getI18nCatalog: function () {
            return 'Products'
        }
    },

    destruct: function () {
        //TODO: DESTRUCT
    }
});