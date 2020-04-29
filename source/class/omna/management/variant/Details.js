/**
 * @childControl tabsPanel {qx.ui.tabview.TabView} show the tabs of variant details.
 * @childControl general-tab {omna.management.variant.DetailsGeneral} show the general variant properties.
 */
qx.Class.define("omna.management.variant.Details", {
    extend: omna.management.AbstractManagement,
    include: [omna.mixin.MSettings, omna.mixin.MLogo],

    statics: {
        propertiesDefaultValues: qx.lang.Object.mergeWith(
            {}, omna.management.AbstractManagement.propertiesDefaultValues, false
        )
    },

    // override
    construct: function (settings, customData, modulePage) {
        settings.requestManagementClass = 'omna.request.Variants';

        this.base(arguments, settings, customData, modulePage);

        this._integrationPages = [];

        this.setAppearance('management');

        this._createChildControl("general-tab");

        this.setCustomData(customData ? customData : {});

        this.addMessagingListener("execute-reload", this.onExecuteReload);
        this.addMessagingListener("execute-remove", this.onExecuteRemove);

        this.emitMessaging('execute-reload', null, 'VariantsDetails');
    },

    members: {
        // overridden
        _createChildControlImpl: function (id, hash) {
            var control;

            switch ( id ) {
                case "tabsPanel":
                    control = new omna.ui.tabview.TabView();
                    this._add(control, { flex: 2 });
                    break;

                case "general-tab":
                    control = new omna.management.variant.DetailsGeneral(this);
                    this.getChildControl('tabsPanel').add(control);
                    break;
            }

            return control || this.base(arguments, id);
        },

        _createTapPage: function (control, label, icon) {
            var page = new omna.ui.tabview.Page(label, icon);

            page.set({ layout: new qx.ui.layout.VBox() });
            page.add(control, { flex: 1 });

            this.getChildControl('tabsPanel').add(page);
            return page;
        },

        _removeIntegrationTapPages: function () {
            var tabsPanel = this.getChildControl('tabsPanel');

            this._integrationPages.forEach(function (page) {
                tabsPanel.remove(page);
                page.destroy();
            });

            this._integrationPages = []
        },

        _createIntegrationTapPages: function (integrations) {
            this._removeIntegrationTapPages();
            integrations.forEach(function (integration) {
                var tab = new omna.management.variant.DetailsProperties(this, integration);

                this._integrationPages.push(tab);
                this.getChildControl('tabsPanel').add(tab);
            }, this);
        },

        onExecuteReload: function (e) {
            var request = this.getRequestManagement(),
                data = this.getCustomData();

            this.emitMessaging('enabled-toolbar', false);
            this.setEnabled(false);
            request.reload(data.item, function (response) {
                this.setEnabled(true);
                this.emitMessaging('enabled-toolbar', true);
                if (response.successful) data.item = response.data;
                this.setCustomData(qx.lang.Object.clone(data, false));
            }, this);
        },

        onExecuteRemove: function () {
            this.getModulePage().fireEvent("close");
        },

        onChangeCustomData: function (e) {
            var data = e.getData(),
                item = data.item || {};

            this.getChildControl('general-tab').setData(item, true);
            this._createIntegrationTapPages(item.integrations || []);

            this.emitMessaging("selection-change", { index: data.index, item: data.item, sender: this });
        }

    }
});