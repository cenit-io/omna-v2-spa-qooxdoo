/**
 * @asset(qx/icon/${qx.icontheme}/16/apps/office-calendar.png)
 */
qx.Class.define("omna.form.field.calendar.DateField", {
    extend: qx.ui.form.DateField,
    include: [
        omna.form.field.util.MSetProperties,
        omna.form.field.util.MReadOnly
    ],

    statics: {
        cellRendererClass: omna.table.cellrenderer.Date,

        parseValue: function (value) {
            return new Date(value);
        }
    },

    properties: {
        strDateFormat: {
            check: 'String',
            apply: '_applyStrDateFormat'
        }
    },

    construct: function () {
        this.base(arguments);
        this.set({ allowGrowY: false })
    },

    members: {
        _applyStrDateFormat: function (value) {
            this.setDateFormat(new qx.util.format.DateFormat(value));
        },

        // override
        setValue: function (value) {
            if (qx.lang.Type.isString(value)) value = this.getDateFormat().parse(value);

            return this.base(arguments, value);
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