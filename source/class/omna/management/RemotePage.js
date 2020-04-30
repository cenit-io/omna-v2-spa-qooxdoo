qx.Class.define("omna.management.RemotePage", {
    extend: omna.management.AbstractManagement,

    statics: {
        propertiesDefaultValues: qx.lang.Object.mergeWith(
            { src: '/src' },
            omna.management.AbstractManagement.propertiesDefaultValues, false
        )
    },

    // override
    construct: function (settings, customData, modulePage) {
        this.base(arguments, settings, customData, modulePage);

        let frame = new qx.ui.embed.ThemedIframe();

        frame.setSource(settings.src);

        this.add(frame, { flex: 2 });
    }
});
