qx.Class.define("omna.management.Page", {
    extend: qx.ui.tabview.Page,

    construct: function (module, components, customData) {
        var i18nCatalog = module.i18n || module.id,
            layoutClass = new qx.ui.layout.Dock(5),
            label;

        layoutClass.setSeparatorX("separator-horizontal");
        layoutClass.setSeparatorY("separator-vertical");

        if (customData.label) {
            label = qx.lang.Type.isArray(customData.label) ? customData.label.join(' / ') : customData.label;
        } else {
            label = omna.I18n.trans(i18nCatalog, 'Labels', 'MODULE-REFERENCE');
        }

        this.base(arguments, label);
        this.id = module.id;
        this.set({
            showCloseButton: true,
            layout: layoutClass,
            allowGrowX: true,
            module: module
        });

        components.forEach(function (componentSettings) {
            var componentClass = qx.Class.getByName(componentSettings.widgetClass);

            if (componentClass) {
                componentSettings.i18n = componentSettings.i18n || componentSettings.id;

                var component = new componentClass(componentSettings, customData, this),
                    width = componentSettings.region || componentClass.propertiesDefaultValues.region,
                    edge = componentSettings.edge || componentClass.propertiesDefaultValues.edge;

                this.add(component, { edge: edge, width: width + '%' });
            } else {
                q.messaging.emit("Application", "error",
                    omna.I18n.trans('CLASS_NO_FOUND', [componentSettings.widgetClass])
                );
            }
        }, this);
    },

    properties: {
        globalSearchText: {
            check: 'String',
            init: ''
        },

        module: {
            check: 'Object'
        }
    },

    members: {
        setCustomData: function (customData) {
            if (customData.label) {
                this.setLabel(qx.lang.Type.isArray(customData.label) ? customData.label.join(' / ') : customData.label);
            }

            this.getChildren().forEach(function (child) {
                child.setCustomData && child.setCustomData(customData);
            }, this);
        }
    }
});
