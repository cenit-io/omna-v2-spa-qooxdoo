qx.Class.define("omna.form.field.SwitchRadioBox", {
    extend: omna.form.field.util.AbstractSwitchRadioBox,

    statics: {
        cellRendererClass: omna.table.cellrenderer.String
    },

    construct: function () {
        this.base(arguments, 'ON', 'OFF');
    },

    properties: {
        value: {
            check: ['ON', 'OFF'],
            event: 'changeValue',
            apply: '_applyValue',
            transform: '_transformValue'
        },

        onLabel: {
            check: 'String',
            init: 'Common.Labels.On'
        },

        offLabel: {
            check: 'String',
            init: 'Common.Labels.Off'
        }
    }
});