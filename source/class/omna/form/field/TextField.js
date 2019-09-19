qx.Class.define("omna.form.field.TextField", {
    extend: qx.ui.form.TextField,
    include: [
        omna.form.field.util.MSetProperties,
        omna.form.field.util.MPatterns
    ],

    statics: {
        cellRendererClass: omna.table.cellrenderer.String,
        validatorClass: omna.form.validator.TextField
    }
});