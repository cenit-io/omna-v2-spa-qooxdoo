qx.Class.define("omna.management.Page", {
  extend: qx.ui.tabview.Page,
  include: [omna.mixin.MI18n],

  construct: function (module, components, customData) {
    let layoutClass = new qx.ui.layout.Dock(5),
      label;

    this.setModule(module);

    layoutClass.setSeparatorX("separator-horizontal");
    layoutClass.setSeparatorY("separator-vertical");

    if (customData.label) {
      label = qx.lang.Type.isArray(customData.label) ? customData.label.join(' / ') : customData.label;
    } else {
      label = this.i18nTrans('MODULE-REFERENCE');
    }

    this.base(arguments, label);
    this.id = module.id;
    this.set({
      showCloseButton: true,
      layout: layoutClass,
      allowGrowX: true
    });

    components.forEach(function (componentSettings) {
      let componentClass = qx.Class.getByName(componentSettings.widgetClass);

      if (componentClass) {
        componentSettings.i18n = componentSettings.i18n || componentSettings.id;

        let component = new componentClass(componentSettings, customData, this),
          width = componentSettings.region || componentClass.propertiesDefaultValues.region,
          edge = componentSettings.edge || componentClass.propertiesDefaultValues.edge;

        this.add(component, { edge: edge, width: width + '%' });
      } else {
        this.error("CLASS_NO_FOUND", [componentSettings.widgetClass]);
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
    },

    getI18nCatalog: function () {
      let module = this.getModule();

      return module.i18n || module.id;
    }
  }
});
