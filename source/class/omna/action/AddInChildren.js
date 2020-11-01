qx.Class.define("omna.action.AddInChildren", {
  extend: omna.action.Add,

  construct: function (management) {
    this.base(arguments, management);
    this.setEnabled(false);
    this.addMessagingListener('selection-change',
      this.onSelectionChange,
      management.getSettings().listenFromComponentId
    );
  },

  members: {
    onSelectionChange: function (data) {
      this.setEnabled(data.customData != null);
    }
  }
});
