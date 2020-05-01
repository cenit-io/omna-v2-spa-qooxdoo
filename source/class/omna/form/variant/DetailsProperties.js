qx.Class.define("omna.form.variant.DetailsProperties", {
    extend: omna.form.AbstractDetailsProperties,

    members: {
        getProperties: function () {
            return this.getIntegration().variant.properties;
        },

        getI18nCatalog: function () {
            return 'Variants'
        }
    }
});