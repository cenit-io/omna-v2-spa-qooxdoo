qx.Class.define('omna.management.variant.DetailsGeneral', {
    extend: omna.management.product.DetailsGeneral,

    statics: {
        detailsGeneralClass: omna.form.variant.DetailsGeneral
    },

    members: {
        _relaod: function () {
            this.emitMessaging('execute-reload', null, 'VariantsDetails');
            this.emitMessaging('execute-reload', null, 'Variants');
        }
    }
});