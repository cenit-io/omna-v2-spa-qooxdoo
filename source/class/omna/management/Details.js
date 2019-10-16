qx.Class.define("omna.management.Details", {
    extend: omna.management.HtmlEmbed,
    include: [omna.mixin.MSettings],

    statics: {
        propertiesDefaultValues: omna.management.HtmlEmbed.propertiesDefaultValues
    },

    // override
    construct: function (settings, customData, modulePage) {
        this.base(arguments, settings, customData, modulePage);

        this.emitMessaging("selection-change", { index: customData.index, item: customData.item, sender: this });
    },

    members: {
        _setContent: function (item) {
            if (!this.getContentTemplate()) {
                var settings = this.getSettings(),
                    templateFile = 'omna/templates/' + (settings.template || settings.id) + '.html.hbs';

                this.loadTemplate(templateFile, function (template) {
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
