qx.Class.define("omna.form.product.DetailsGeneral", {
  extend: omna.form.AbstractForm,

  members: {
    _createFormFields: function () {
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

      this._createPackageNumberField('package.weight', 10, 1000000000, ' g')
      this._createPackageNumberField('package.height', 10, null, ' mm');
      this._createPackageNumberField('package.length', 10, null, ' mm');
      this._createPackageNumberField('package.width', 10, null, ' mm');

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

    _createPackageNumberField: function (name, min, max, postfix) {
      let widget = new omna.form.field.NumberField().set({
        required: false,
        minimum: min ? min : 10,
        maximum: max ? max : Number.MAX_SAFE_INTEGER,
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
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