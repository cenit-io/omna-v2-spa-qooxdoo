qx.Class.define("omna.form.field.boolean.RadioBox", {
    extend: omna.form.field.util.AbstractSwitchRadioBox,

    statics: {
        cellRendererClass: omna.table.cellrenderer.Boolean,

        parseValue: function (value) {
            if (qx.lang.Type.isString(value)) value = value.toLowerCase();

            return value === true || value === 'true' || value === 'on' || value === 1 || value === '1';
        }
    },

    construct: function () {
        this.base(arguments, true, false);
    },

    properties: {
        value: {
            check: 'Boolean',
            event: 'changeValue',
            apply: '_applyValue'
        },

        trueLabel: {
            check: 'String',
            init: 'Common.Labels.True'
        },

        falseLabel: {
            check: 'String',
            init: 'Common.Labels.False'
        }
    }
});