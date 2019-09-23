qx.Class.define("omna.I18n", {
    type: 'singleton',
    extend: qx.core.Object,
    include: [omna.mixin.MSettings],

    statics: {
        /**
         * Translate a text subscribed in the i18n catalog.
         *
         * @param catalog {String?'Common'}
         * @param subCatalog {String?'Labels'}
         * @param name {String}
         * @param args {Map?}
         * @return {String|boolean}
         */
        trans: function (catalog, subCatalog, name, args) {
            var i18n = omna.I18n.getInstance();

            return i18n.trans.apply(i18n, arguments);
        }
    },

    /**
     * Constructor
     */
    construct: function () {
        this.base(arguments);

        this.__loadedCatalogs = {};
        this.__load('Common');
    },

    members: {
        __loadedCatalogs: null,

        __load: function (catalog) {
            var manager = qx.locale.Manager.getInstance(),
                locale = manager.getLocale(),
                translationMap = {},

                fillTranslationMap = function (items) {
                    items.forEach(function (item) {
                        var i18nId = catalog + '.' + item.subCatalog + '.' + item.name;
                        translationMap[i18nId] = item.value;
                    });
                };

            if (locale != 'en') this.loadSettings('omna/settings/i18ns/en/' + catalog, fillTranslationMap);

            this.loadSettings('omna/settings/i18ns/' + locale + '/' + catalog, fillTranslationMap);

            this.__loadedCatalogs[catalog] = true;

            manager.addTranslation(locale, translationMap);
        },

        /**
         * Translate a text subscribed in the i18n catalog.
         *
         * @param catalog {String?'Common'}
         * @param subCatalog {String?'Labels'}
         * @param name {String}
         * @param args {Map?}
         * @return {String|boolean}
         */
        trans: function (catalog, subCatalog, name, args) {
            var aux, create = true, leng = arguments.length;

            if (leng === 1 || (leng === 2 && !qx.lang.Type.isString(subCatalog))) {
                args = subCatalog;
                aux = catalog.split('.');
                name = aux.pop();
                subCatalog = aux.pop() || 'Labels';
                catalog = aux.pop() || 'Common';
            } else if (leng === 2 || (leng === 3 && !qx.lang.Type.isString(name))) {
                args = name;
                name = subCatalog;
                subCatalog = catalog;
                catalog = 'Common';
            }

            if (!this.__loadedCatalogs[catalog]) this.__load(catalog);

            if (typeof args != 'undefined' && qx.lang.Type.isBoolean(args)) {
                create = args;
                args = [];
            }

            var manager = qx.locale.Manager.getInstance(),
                i18nId = catalog + '.' + subCatalog + '.' + name,
                trans1, trans2;

            trans1 = manager.translate(i18nId, args || []);

            if (trans1 == i18nId) {
                i18nId = 'Common.' + subCatalog + '.' + name;
                trans2 = manager.translate(i18nId, args || []);

                if (trans2 == i18nId) return create ? trans1 : false;

                trans1 = trans2
            }

            return String(trans1);
        }

    },

    destruct: function () {
        this.__loadedCatalogs = null;
    }
});
