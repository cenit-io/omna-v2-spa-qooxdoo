qx.Class.define("omna.form.field.NumberField", {
  extend: qx.ui.form.Spinner,
  include: [
    omna.form.field.util.MSetProperties,
    omna.form.field.util.MReadOnly
  ],

  statics: {
    cellRendererClass: omna.table.cellrenderer.Number,

    parseValue: function (value) {
      let n = new Number(value);
      return n.valueOf();
    }
  },

  // override
  construct: function () {
    this.base(arguments);
    this.setValue(null);
    this.setNumberFormat(new qx.util.format.NumberFormat);
  },

  properties: {
    minimum: {
      refine: true,
      init: -Number.MAX_VALUE
    },

    maximum: {
      refine: true,
      init: Number.MAX_VALUE
    },

    maximumFractionDigits: {
      init: 3,
      apply: '_applyMaximumFraction'
    },

    minimumFractionDigits: {
      init: 1,
      apply: '_applyMinimumFraction'
    },

    postfix: {
      check: 'String',
      nullable: true,
      apply: '_applyPostfix'
    },

    prefix: {
      check: 'String',
      nullable: true,
      apply: '_applyPrefix'
    }
  },

  members: {
    _updateButtons: function () {
      if (!this.isReadOnly()) {
        this.base(arguments);
      }
    },

    _applyMaximumFraction: function (value) {
      this.getNumberFormat().setMaximumFractionDigits(value);
    },

    _applyMinimumFraction: function (value) {
      this.getNumberFormat().setMinimumFractionDigits(value);
    },

    _applyPostfix: function (value) {
      this.getNumberFormat().setPostfix(value || "");
    },

    _applyPrefix: function (value) {
      this.getNumberFormat().setPrefix(value || "");
    },

    // overridden
    _checkValue: function (value) {
      if (value === "" || value === null) {
        return true;
      }
      return this.base(arguments, value);
    },

    // overridden
    _onTextChange: function (e) {
      let value = this.getChildControl("textfield").getValue();

      if (!this.isRequired() && (value === "" || value === null)) {
        this.setValue(null);
      } else {
        this.base(arguments, e);
      }
    },

    // overridden
    _onRoll: function (e) {
      if (!this.isReadOnly()) {
        let textField = this.getChildControl('textfield'),
          focusedWidget = qx.ui.core.FocusHandler.getInstance().getFocusedWidget();

        // If this widget has the focus then apply parent _onRoll.
        if ((focusedWidget == this) || (focusedWidget == textField)) {
          this.base(arguments, e);
        }
      }
    }
  }
});