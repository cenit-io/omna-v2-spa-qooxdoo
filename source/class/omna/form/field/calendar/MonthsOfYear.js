qx.Class.define("omna.form.field.calendar.MonthsOfYear", {
    extend: omna.form.field.calendar.AbstractCheckField,

    members: {
        _rowSize: 6,

        getItems: function () {
            return qx.locale.Date.getMonthNames('abbreviated', 'en').map(function (item) {
                return item.toString()
            })
        },

        getItemLabel: function (idx) {
            return qx.locale.Date.getMonthName('abbreviated', idx)
        },

        getItemValue: function (idx) {
            return qx.locale.Date.getMonthName('abbreviated', idx, 'en')
        }
    }
});