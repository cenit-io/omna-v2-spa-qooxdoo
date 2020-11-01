/**
 * @childControl tabsPanel {qx.ui.tabview.TabView} show the tabs of task details.
 */
qx.Class.define("omna.management.TabViews", {
  extend: omna.management.AbstractManagement,
  include: [omna.mixin.MSettings],

  statics: {
    propertiesDefaultValues: qx.lang.Object.mergeWith(
      {}, omna.management.AbstractManagement.propertiesDefaultValues, false
    )
  },

  // override
  construct: function (settings, customData, modulePage) {
    this.base(arguments, settings, customData, modulePage);

    this.setAppearance('management');

    this.getSettings().tabs.forEach(this._createTapPage, this)
  },

  members: {
    // overridden
    _createChildControlImpl: function (id, hash) {
      let control;

      switch ( id ) {
        case "tabsPanel":
          control = new qx.ui.tabview.TabView('bottom');
          this._add(control, { flex: 2 });
          break;
      }

      return control || this.base(arguments, id);
    },

    _createTapPage: function (componentId) {
      this.loadSettings('omna/settings/components/' + componentId, function (components) {
        let page = new omna.management.Page({ id: components[0].id }, components, {});

        page.setShowCloseButton(false);

        this.getChildControl("tabsPanel").add(page);
      }, this);
    }
  }
});