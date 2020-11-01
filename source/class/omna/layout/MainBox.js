qx.Class.define("omna.layout.MainBox", {
  type: "singleton",
  extend: qx.ui.tabview.TabView,
  include: [omna.mixin.MSettings],

  construct: function () {
    this.base(arguments);

    this._pages = {};

    // Create route handler for messaging channels.
    q.messaging.on("Application", "update-session", this.onUpdateSession, this);
    q.messaging.on("Application", "open-module", this.onOpenModule, this);

    this.addListener('changeSelection', this.onChangeSelection, this);
  },

  members: {
    _pages: null,

    /**
     * Fired after session is login or logout.
     *
     * @param data {Object} Message data with response info from login or logout action.
     */
    onUpdateSession: function (data) {
      // Close all tabs.
      for (let id in this._pages) this._pages[id].fireEvent('close');
    },

    /**
     * Fired emitted 'open-module' message as when done double-click in a node of the tree of modules.
     *
     * @param data {Object} Message data with selected module info.
     */
    onOpenModule: function (data) {
      let module = data.params,
        page = this._pages[module.id],
        i18nCatalog = module.i18n || module.id,
        customData = data.customData || module.customData || {};

      if (customData === 'current-tenant') {
        customData = { index: null, item: omna.request.Session.getProfile(), sender: this }
      }

      if (!page) {
        this.loadSettings('omna/settings/components/' + module.id, function (components) {
          if (components.length == 0) {
            if (!module.children) {
              q.messaging.emit('Application', 'warn',
                omna.I18n.trans('Modules', 'Messages', 'EMPTY', [
                  omna.I18n.trans(i18nCatalog, 'Labels', 'MODULE-REFERENCE')
                ])
              );
            }
          } else {
            page = new omna.management.Page(module, components, customData);
            page.addListener('close', this.onClosePage, this);

            this.add(page);
            this._pages[page.id] = page;
            this.setSelection([page]);
          }
        });
      } else {
        this.setSelection([page]);
        page.setCustomData(customData);
      }
    },

    /**
     * Fired when closed one tab.
     *
     * @param e {qx.event.type.Event}
     */
    onClosePage: function (e) {
      let page = e.getTarget();
      delete this._pages[page.id];
      qx.event.Timer.once(page.destroy, page, 500);
    },

    onChangeSelection: function (e) {
      q.messaging.emit("Application", "change-active-module", e.getData()[0]);
    }
  }
});
