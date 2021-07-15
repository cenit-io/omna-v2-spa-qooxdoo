qx.Class.define('omna.form.field.remote.integrations.ListBox', {
  extend: qx.ui.form.List,
  include: omna.mixin.MLogo,

  construct: function () {
    this.base(arguments);
    this.setSelectionMode('additive');
    this.__listItems = [];
    this.__loadItems();
  },

  properties: {
    disableUnauthorized: {
      check: 'Boolean',
      init: true,
      apply: '_applyDisableUnauthorized'
    }
  },

  members: {
    __listItems: null,
    __requestManagement: null,

    __loadItems: function () {
      this.__requestManagement = this.__requestManagement || new omna.request.Connections();

      this.removeAll();

      this.__requestManagement.setAsync(false);
      this.__requestManagement.all(function (response) {
        let label, listItem, enabled, disableUnauthorized = this.isDisableUnauthorized();

        if (response.successful) response.data.forEach(function (item) {
          label = qx.bom.Template.render(omna.I18n.trans('Titles', 'INTEGRATION'), { integration: item });
          enabled = disableUnauthorized === false || item.authorized === true;

          listItem = new qx.ui.form.ListItem(label, item.logo_icon, item.id);
          listItem.set({ enabled: enabled, rich: true });
          this.add(listItem);
          this.__listItems.push(listItem);
        }, this);
      }, this);
    },

    _applyDisableUnauthorized: function () {
      this.__loadItems();
    },

    getListItems: function () {
      return this.__listItems;
    }
  },

  destruct: function () {
    delete this.__listItems;
  }
});