qx.Class.define("omna.form.field.calendar.DaysOfWeek", {
  extend: omna.form.field.calendar.AbstractCheckField,

  members: {
    _rowSize: 7,

    getItems: function () {
      return qx.locale.Date.getDayNames('abbreviated', 'en').map(function (item) {
        return item.toString()
      })
    },

    getItemLabel: function (idx) {
      return qx.locale.Date.getDayName('abbreviated', idx)
    },

    getItemValue: function (idx) {
      return qx.locale.Date.getDayName('abbreviated', idx, 'en')
    }
  }
});