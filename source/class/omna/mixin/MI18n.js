qx.Mixin.define('omna.mixin.MI18n', {
    members: {
        /**
         * Translate a text subscribed in the i18n catalog.
         *
         * @param catalog {String?'Common'}
         * @param subCatalog {String?'Labels'}
         * @param name {String}
         * @param args {Map?}
         * @return {String|boolean}
         */
        i18nTrans: function (catalog, subCatalog, name, args) {
            var leng = arguments.length;

            if (leng === 1 || (leng === 2 && !qx.lang.Type.isString(subCatalog))) {
                args = subCatalog;
                name = catalog;
                subCatalog = 'Labels';
                catalog = this.getI18nCatalog();
            } else if (leng === 2 || (leng === 3 && !qx.lang.Type.isString(name))) {
                args = name;
                name = subCatalog;
                subCatalog = catalog;
                catalog = this.getI18nCatalog();
            }

            return omna.I18n.trans(catalog, subCatalog, name, args);
        },

        notify: function(type, name, args) {
            q.messaging.emit('Application', type, this.i18nTrans('Messages', name, args));
        },

        good: function (name, args) {
            this.notify('good', name, args);
        },

        info: function (name, args) {
            this.notify('info', name, args);
        },

        warn: function (name, args) {
            this.notify('warn', name, args);
        },

        error: function (name, args) {
            this.notify('error', name, args);
        }
    }
});
