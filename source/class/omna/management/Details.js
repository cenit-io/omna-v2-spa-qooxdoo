qx.Class.define("omna.management.Details", {
  extend: omna.management.HtmlEmbed,
  include: [omna.mixin.MSettings],

  statics: {
    propertiesDefaultValues: qx.lang.Object.mergeWith(
      {}, omna.management.HtmlEmbed.propertiesDefaultValues, false
    )
  },

  // override
  construct: function (settings, customData, modulePage) {
    this.base(arguments, settings, customData, modulePage);

    this.addMessagingListener("execute-reload", this.onExecuteReload);
  },

  members: {
    _setContent: function (data) {
      if (!this.getContentTemplate()) {
        let settings = this.getSettings(),
          templateFile = 'omna/templates/' + (settings.template || settings.id) + '.html.hbs';

        this.loadTemplate(templateFile, function (template) {
          this.setContentTemplate(template);
          this._setContent(data)
        }, this);
      } else {
        this.base(arguments, data)
      }
    },

    onExecuteReload: function (e) {
      let request = this.getRequestManagement(),
        data = this.getCustomData();

      this.emitMessaging('enabled-toolbar', false);
      request.reload(data.item, function (response) {
        this.emitMessaging('enabled-toolbar', true);
        if (response.successful) this.setCustomData({
          item: response.data,
          index: data.index,
          label: data.label
        });
      }, this);
    },

    onChangeCustomData: function (e) {
      let data = e.getData();
      this.base(arguments, e);
      this.emitMessaging('selection-change', { index: data.index, item: data.item, sender: this });
    }
  }
});
