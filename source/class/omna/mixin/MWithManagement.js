qx.Mixin.define('omna.mixin.MWithManagement', {

    properties: {
        management: {
            check: 'omna.management.AbstractManagement'
        }
    },

    members: {
        /**
         * Translate a text subscribed in the i18n catalog.
         *
         * @param catalog {String?'Common'}
         * @param subCatalog {String?'Labels'}
         * @param name {String}
         * @param args {Array?}
         * @return {String|boolean}
         */
        i18nTrans: function (catalog, subCatalog, name, args) {
            var management = this.getManagement();

            return management.i18nTrans.apply(management, arguments)
        }
    }
});
