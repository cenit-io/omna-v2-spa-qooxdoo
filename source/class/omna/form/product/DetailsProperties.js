qx.Class.define("omna.form.product.DetailsProperties", {
    extend: omna.form.AbstractDetailsProperties,

    members: {
        getProperties: function () {
            return this.getIntegration().product.properties;
        },

        getI18nCatalog: function () {
            return 'Products'
        }
    }
});