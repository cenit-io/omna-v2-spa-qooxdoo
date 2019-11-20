qx.Class.define("omna.form.field.net.URLField", {
    extend: qx.ui.form.TextField,
    include: omna.form.field.util.MSetProperties,

    statics: {
        cellRendererClass: omna.table.cellrenderer.String,
        validatorClass: omna.form.validator.net.URLField
    },

    properties: {
        filter: {
            refine: true,
            init: new RegExp('.')
        }
    }
});
