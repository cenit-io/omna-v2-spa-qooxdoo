/**
 * @childControl tabsPanel {qx.ui.tabview.TabView} show the tabs of product details.
 * @childControl general-tab {omna.management.product.DetailsGeneral} show the general product properties.
 */
qx.Class.define("omna.management.product.Details", {
  extend: omna.management.AbstractManagement,
  include: [omna.mixin.MSettings, omna.mixin.MLogo],

  statics: {
    detailsGeneralClass: omna.management.product.DetailsGeneral,
    detailsPropertiesClass: omna.management.product.DetailsProperties,
    requestManagementClass: omna.request.Products,
    managementId: 'ProductsDetails',
    propertiesDefaultValues: qx.lang.Object.mergeWith(
      {}, omna.management.AbstractManagement.propertiesDefaultValues, false
    )
  },

  // override
  construct: function (settings, customData, modulePage) {
    settings.requestManagementClass = this.constructor.requestManagementClass;

    this.base(arguments, settings, customData, modulePage);

    this._integrationPages = [];

    this.setAppearance('management');

    this._createChildControl("general-tab");

    this.addMessagingListener("execute-reload", this.onExecuteReload);
    this.addMessagingListener("execute-remove", this.onExecuteRemove);

    this.setCustomData(customData ? customData : {});
  },

  members: {
    // overridden
    _createChildControlImpl: function (id, hash) {
      let control;

      switch ( id ) {
        case "tabsPanel":
          control = new omna.ui.tabview.TabView();
          this._add(control, { flex: 2 });
          break;

        case "general-tab":
          control = new this.constructor.detailsGeneralClass(this);
          this.getChildControl('tabsPanel').add(control);
          break;
      }

      return control || this.base(arguments, id);
    },

    _createTapPage: function (control, label, icon) {
      let page = new omna.ui.tabview.Page(label, icon);

      page.set({ layout: new qx.ui.layout.VBox() });
      page.add(control, { flex: 1 });

      this.getChildControl('tabsPanel').add(page);
      return page;
    },

    _removeIntegrationTapPages: function () {
      let tabsPanel = this.getChildControl('tabsPanel');

      this._integrationPages.forEach(function (page) {
        tabsPanel.remove(page);
        page.destroy();
      });

      this._integrationPages = []
    },

    _createIntegrationTapPages: function (integrations) {
      this._removeIntegrationTapPages();
      integrations.forEach(function (integration) {
        let tab = new this.constructor.detailsPropertiesClass(this, integration);

        this._integrationPages.push(tab);
        this.getChildControl('tabsPanel').add(tab);
      }, this);
    },

    onExecuteReload: function (e) {
      let request = this.getRequestManagement(),
        data = this.getCustomData();

      this.emitMessaging('enabled-toolbar', false);
      this.setEnabled(false);
      request.reload(data.item, function (response) {
        this.setEnabled(true);
        this.emitMessaging('enabled-toolbar', true);
        if (response.successful) {
          data = qx.lang.Object.clone(data, false)
          data.item = response.data;
          data.with_details = true;
          this.setCustomData(data);
        }
      }, this);
    },

    onExecuteRemove: function () {
      this.getModulePage().fireEvent("close");
    },

    onChangeCustomData: function (e) {
      let customData = qx.lang.Object.clone(e.getData(), true),
        item = customData.item || {};

      customData.sender = this;

      this.getChildControl('general-tab').setData(item, true);
      this._createIntegrationTapPages(item.integrations || []);

      this.emitMessaging('selection-change', customData);
      if (customData.with_details) return;
      this.emitMessaging('execute-reload', null, this.constructor.managementId);
    }

  }
});