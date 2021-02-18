qx.Class.define("omna.form.variant.DetailsGeneral", {
  extend: omna.form.product.DetailsGeneral,

  members: {
    _createFormFields: function () {
      let widget;

      widget = new omna.form.field.TextField();
      widget.set({ required: true });
      this._add(widget, 'sku', 4);

      widget = new omna.form.field.NumberField();
      widget.set({ required: true, minimum: 0, maximumFractionDigits: 2, prefix: '$' });
      this._add(widget, 'price', 1);

      widget = new omna.form.field.NumberField();
      widget.set({ required: true, minimum: 0, maximumFractionDigits: 2, prefix: '$' });
      this._add(widget, 'original_price', 1);

      this.addGroupHeader(this.i18nTrans('package'));

      this._createPackageNumberField('package.weight', 10, 1000000000, ' g');
      this._createPackageNumberField('package.height', 10, null, ' mm');
      this._createPackageNumberField('package.length', 10, null, ' mm');
      this._createPackageNumberField('package.width', 10, null, ' mm');

      widget = new omna.form.field.TextArea();
      widget.set({ required: false });

      this._add(widget, 'package.content', 4);
    },

    getI18nCatalog: function () {
      return 'Variants'
    }
  },

  destruct: function () {
    //TODO: DESTRUCT
  }
});