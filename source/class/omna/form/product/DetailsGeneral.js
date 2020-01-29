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
        },

        getI18nCatalog: function () {
            return 'Products'
        }
    },

    destruct: function(){
        console.log(33333);
    }
});