qx.Class.define("omna.form.field.calendar.WeeksOfMonth", {
    extend: omna.form.field.calendar.AbstractCheckField,

    members: {
        _rowSize: 5,

        getItems: function () {
            return ['First', 'Second', 'Third', 'Fourth', 'Last']
        },

        getItemLabel: function (idx) {
            return this.i18nTrans(this.getItemValue(idx))
        },

        getItemValue: function (idx) {
            return this.getItems()[idx]
        }
    }
});