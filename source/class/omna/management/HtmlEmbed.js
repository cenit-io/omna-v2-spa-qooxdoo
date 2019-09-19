qx.Class.define("omna.management.HtmlEmbed", {
    extend: omna.management.AbstractManagement,

    statics: {
        propertiesDefaultValues: {
            i18n: 'Common',
            content: '',
            edge: 'center',
            region: 100
        }
    },

    // override
    construct: function (settings, customData, modulePage) {
        this.base(arguments, settings, customData, modulePage);

        var htmlEmbed = new qx.ui.embed.Html(settings.content);

        htmlEmbed.set({
            overflowX: 'auto',
            overflowY: 'auto'
        });

        this.add(htmlEmbed, { flex: 1 });
    }
});