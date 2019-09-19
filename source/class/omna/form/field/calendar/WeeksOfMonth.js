// TODO: omna.form.field.calendar.WeeksOfMonth
qx.Class.define("omna.form.field.calendar.WeeksOfMonth", {
    extend: omna.form.field.TextField,

    statics: {
        cellRendererClass: omna.table.cellrenderer.String,

        parseValue: function (value) {
            return new Date(value);
        }
    },


    members: {
        // override
        setValue: function (value) {
            if (qx.lang.Type.isArray(value)) value = value.join(',');

            return this.base(arguments, value);
        },

        // override
        getValue: function () {
            var value = this.base(arguments);

            return value ? value.split(',') : null
        },

        validate: function (form) {
            var value = this.getValue();

            if (value == null && this.isRequired()) {
                return this.tr('This field is required');
            }

            return true;
        }
    }
});