qx.Mixin.define("omna.form.field.util.MPatterns", {

  properties: {
    pattern: {
      check: 'String',
      transform: '__transformPattern',
      init: '.*'
    },

    filterIn: {
      check: 'String',
      nullable: true,
      transform: '__transformFilter',
      apply: '__applyFilterIn'
    },

    minLength: {
      check: 'Integer',
      init: 0
    }
  },

  members: {
    /**
     * Create an set filter value with new RegExp from given string in filterIn property.
     * @param value {String} Regular expression as string.
     */
    __applyFilterIn: function (value) {
      this.setFilter(new RegExp(value));
    },

    /**
     * Normalise pattern value.
     * @param value {String} Regular expression as string or pattern name.
     */
    __transformPattern: function (value) {
      let newValue = omna.I18n.trans('Patterns', 'Values', value);
      return newValue.match(/^Patterns\.Values\./) ? value : newValue;
    },

    /**
     * Normalise filter value.
     * @param value {String} Regular expression as string or filter name.
     */
    __transformFilter: function (value) {
      let newValue = omna.I18n.trans('Filters', 'Values', value);
      return newValue.match(/^Filters\.Values\./) ? value : newValue;
    }
  }

});