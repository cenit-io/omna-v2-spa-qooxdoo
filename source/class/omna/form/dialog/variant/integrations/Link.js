qx.Class.define("omna.form.dialog.variant.integrations.Link", {
  extend: omna.form.dialog.integration.AbstractLink,

  members: {
    setData: function (data, redefineResetter) {
      data = {
        id: data.id,
        integration_ids: data.integrations ? data.integrations.map((integration) => integration.id) : []
      };

      return this.base(arguments, data, redefineResetter);
    }
  }
});