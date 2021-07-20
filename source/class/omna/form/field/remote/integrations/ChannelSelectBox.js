qx.Class.define('omna.form.field.remote.integrations.ChannelSelectBox', {
  extend: omna.form.field.util.AbstractSelectBox,
  include: omna.mixin.MLogo,

  statics: {
    cellRendererClass: omna.table.cellrenderer.String
  },

  construct: function () {
    this.base(arguments);
    this.__loadItems()
  },

  members: {
    __loadItems: function () {
      let request = new omna.request.AvailableIntegrations();

      request.getChannels(function (response) {
        if (response.successful) response.data.forEach(function (item) {
          this.add(new qx.ui.form.ListItem(item.title, item.icon, item.name));
        }, this);
      }, this);
    }
  }
});