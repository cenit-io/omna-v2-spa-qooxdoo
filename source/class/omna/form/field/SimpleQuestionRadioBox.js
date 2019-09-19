qx.Class.define("omna.form.field.SimpleQuestionRadioBox", {
    extend: omna.form.field.util.AbstractSwitchRadioBox,

    statics: {
        cellRendererClass: omna.table.cellrenderer.String
    },

    construct: function () {
        this.base(arguments, 'YES', 'NO');
    },

    properties: {
        value: {
            check: ['YES', 'NO'],
            event: 'changeValue',
            apply: '_applyValue',
            transform: '_transformValue'
        },

        yesLabel: {
            check: 'String',
            init: 'Common.Labels.Yes'
        },

        noLabel: {
            check: 'String',
            init: 'Common.Labels.No'
        }
    }
});