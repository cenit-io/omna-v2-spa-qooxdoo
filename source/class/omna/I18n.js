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
            let i18n = omna.I18n.getInstance();

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
            let manager = qx.locale.Manager.getInstance(),
                locale = manager.getLocale(),
                translationMap = {},

                fillTranslationMap = function (items) {
                    items.forEach(function (item) {
                        let i18nId = catalog + '.' + item.subCatalog + '.' + item.name;
                        translationMap[i18nId] = item.value;
                    });
                };

            if (locale != 'en') this.loadSettings('omna/settings/i18ns/en/' + catalog, fillTranslationMap);

            this.loadSettings('omna/settings/i18ns/' + locale + '/' + catalog, fillTranslationMap);

            this.__loadedCatalogs[catalog] = this.isDevelopment() ? Date.now() : true;

            manager.addTranslation(locale, translationMap);
        },

        __isLoadedCatalogs: function (catalog) {
            let loaded = this.__loadedCatalogs[catalog];

            return this.isDevelopment() ? loaded && (Date.now() - loaded < 30000) : loaded;
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
            let aux, item = null, leng = arguments.length;

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

            this.__isLoadedCatalogs(catalog) || this.__load(catalog);

            if (qx.lang.Type.isObject(args)) {
                item = args;
                args = [];
            }

            let manager = qx.locale.Manager.getInstance(),
                i18nId = catalog + '.' + subCatalog + '.' + name,
                trans1, trans2;

            trans1 = manager.translate(i18nId, args || []).toString();

            if (trans1 == i18nId) {
                i18nId = 'Common.' + subCatalog + '.' + name;
                trans2 = manager.translate(i18nId, args || []).toString();

                if (trans2 != i18nId) trans1 = trans2
            }

            if (item) trans1 = qx.bom.Template.render(trans1, item);

            return trans1;
        }

    },

    destruct: function () {
        this.__loadedCatalogs = null;
    }
});
