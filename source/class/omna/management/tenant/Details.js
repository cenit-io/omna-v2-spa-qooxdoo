qx.Class.define("omna.management.tenant.Details", {
    extend: omna.management.MarkdownEmbed,
    include: [omna.mixin.MSettings],

    statics: {
        propertiesDefaultValues: {
            i18n: 'Common',
            edge: 'center',
            region: 100
        }
    },

    // override
    construct: function (settings, customData, modulePage) {
        this.base(arguments, settings, customData, modulePage);

        this.emitMessaging("selection-change", { index: customData.index, item: customData.item, sender: this });
    },

    members: {
        _setContent: function (item) {
            if (!this.getContentTemplate()) {
                this.loadTemplate('omna/templates/TenantDetails.md.hbs', function (template) {
                    this.setContentTemplate(template);
                    this._setContent(item)
                }, this);
            } else {
                this.base(arguments, item)
            }
        },

        onChangeCustomData: function (e) {
            var data = e.getData();

            this._setContent(data);
            this.emitMessaging("selection-change", { index: data.index, item: data.item, sender: this });
        }
    }
});
