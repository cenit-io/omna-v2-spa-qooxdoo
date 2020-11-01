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
      let leng = arguments.length;

      if (leng === 1 || (leng === 2 && !qx.lang.Type.isString(subCatalog))) {
        args = subCatalog;
        name = catalog;
        subCatalog = 'Labels';
        catalog = this.__getI18nCatalog()
      } else if (leng === 2 || (leng === 3 && !qx.lang.Type.isString(name))) {
        args = name;
        name = subCatalog;
        subCatalog = catalog;
        catalog = this.__getI18nCatalog()
      }

      return omna.I18n.trans(catalog, subCatalog, name, args);
    },

    __getI18nCatalog: function () {
      return this.getI18nCatalog ? this.getI18nCatalog() : 'Common'
    },

    /**
     *
     * @param type {String}
     * @param i18nMsgName {String}
     * @param i18nMsgArgs {String[]?}
     */
    notify: function (type, i18nMsgName, i18nMsgArgs) {
      const msg = this.i18nTrans('Messages', i18nMsgName, i18nMsgArgs);
      q.messaging.emit('Application', type, msg, this || this);
    },

    /**
     *
     * @param i18nMsgName {String}
     * @param i18nMsgArgs {String[]?}
     */
    good: function (i18nMsgName, i18nMsgArgs) {
      this.notify('good', i18nMsgName, i18nMsgArgs, this);
    },

    /**
     *
     * @param i18nMsgName {String}
     * @param i18nMsgArgs {String[]?}
     */
    info: function (i18nMsgName, i18nMsgArgs) {
      this.notify('info', i18nMsgName, i18nMsgArgs, this);
    },

    /**
     *
     * @param i18nMsgName {String}
     * @param i18nMsgArgs {String[]?}
     */
    warn: function (i18nMsgName, i18nMsgArgs, emitParams) {
      this.notify('warn', i18nMsgName, i18nMsgArgs, emitParams, this);
    },

    /**
     *
     * @param i18nMsgName {String}
     * @param i18nMsgArgs {String[]?}
     */
    error: function (i18nMsgName, i18nMsgArgs, emitParams) {
      this.notify('error', i18nMsgName, i18nMsgArgs, emitParams, this);
    }
  }
});
