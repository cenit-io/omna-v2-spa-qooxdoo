qx.Class.define("omna.management.RemotePage", {
    extend: omna.management.AbstractManagement,

    statics: {
        propertiesDefaultValues: {
            i18n: 'Common',
            src: '/src',
            edge: 'center',
            region: 100
        }
    },

    // override
    construct: function (settings, customData, modulePage) {
        this.base(arguments, settings, customData, modulePage);

        var frame = new qx.ui.embed.ThemedIframe();

        frame.setSource(settings.src);

        this.add(frame, { flex: 2 });
    }
});
