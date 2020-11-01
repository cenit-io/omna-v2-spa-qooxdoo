qx.Class.define("omna.form.field.calendar.AbstractCheckField", {
  type: "abstract",
  extend: qx.ui.container.Composite,
  implement: [
    qx.ui.form.IForm,
    qx.ui.form.IBooleanForm,
    omna.mixin.II18n
  ],
  include: [
    qx.ui.form.MForm,
    omna.form.field.util.MSetProperties,
    omna.form.field.util.MReadOnly,
    omna.mixin.MI18n
  ],

  construct: function () {
    let rowSize = this._rowSize;

    this.base(arguments);

    this.__fields = this.getItems().map(function (item, idx) {
      let field = new qx.ui.form.CheckBox(this.getItemLabel(idx));

      this.add(field, { row: Math.trunc(idx / rowSize), column: idx % rowSize });
      field.set({ allowGrowY: true, allowGrowX: true });
      field.addListener('changeValue', this.__onChangeCheckItem, this);

      return field;
    }, this);

    this.set({
      layout: new qx.ui.layout.Grid(5),
      decorator: 'white-box',
      padding: 3,
      allowGrowY: false,
      focusable: true,
      value: []
    });
  },

  properties: {
    value: {
      check: Array,
      nullable: true,
      event: "changeValue",
      apply: "_applyValue"
    }
  },

  members: {
    _rowSize: 7,

    _applyValue: function (value) {
      value = value || [];

      this.getItems().forEach(function (item, idx) {
        this.__fields[idx].setValue(value.indexOf(item) !== -1)
      }, this);
    },

    getItems: function () {
      throw new Error("Abstract method call");
    },

    getItemLabel: function (idx) {
      throw new Error("Abstract method call");
    },

    getItemValue: function (idx) {
      throw new Error("Abstract method call");
    },

    getItemIndex: function (item) {
      return this.getItems().indexOf(item);
    },

    getI18nCatalog: function () {
      return 'Locales'
    },

    validate: function (form) {
      let value = this.getValue();

      if (value == null && this.isRequired()) {
        return this.tr('This field is required');
      }

      return true;
    },

    __onChangeCheckItem: function () {
      this.setValue(
        this.getItems().filter(function (item, idx) {
          return this.__fields[idx].getValue()
        }, this)
      )
    }
  }
});