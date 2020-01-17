qx.Class.define('omna.form.field.remote.integrations.FilteringSelectBox', {
    extend: omna.form.field.remote.FilteringSelectBox,
    include: omna.mixin.MIntegrationLogo,

    construct: function () {
        this.base(arguments);
        this.set({ serviceBasePath: "integrations", labelAttr: "name", valueAttr: "id" });
    },

    members: {
        _getIcon: function (item) {
            return this.integrationLogo(item.channel)
        }
    }
});