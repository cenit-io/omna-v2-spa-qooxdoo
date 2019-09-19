/**
 * @childControl title {qx.ui.basic.Atom} Title component properties panel.
 * @childControl scrollPanel {qx.ui.container.Scroll} Scroll component properties panel.
 * @childControl htmlEmbed {qx.ui.embed.Html} show the html of the content.
 * @ignore(showdown.*)
 */
qx.Class.define("omna.management.MarkdownEmbed", {
    extend: omna.management.AbstractManagement,

    statics: {
        propertiesDefaultValues: {
            i18n: 'Common',
            content: '',
            edge: 'center',
            region: 100,
            listenFromComponentId: null
        }
    },

    // override
    construct: function (settings, customData, modulePage) {
        this.base(arguments, settings, customData, modulePage);

        this.setAppearance('management');

        this._createChildControl("title");
        this._createChildControlImpl('htmlEmbed');

        var listenFromComponentId = settings.listenFromComponentId;

        if (listenFromComponentId) {
            this.addMessagingListener('selection-change', this.onSelectionChange, listenFromComponentId)
        } else {
            this._setContent(customData)
        }
    },

    members: {
        // overridden
        _createChildControlImpl: function (id, hash) {
            var control, title = this.getSettings().title || 'Details';

            switch ( id ) {
                case "title":
                    control = this.__title = new qx.ui.basic.Atom(this.i18nTrans(title));
                    control.setMaxHeight(27);
                    this._add(control, { flex: 2 });
                    break;

                case "htmlEmbed":
                    this.__showdownConverter = new showdown.Converter();
                    this.__showdownConverter.setOption('tables', true);

                    control = this.__htmlEmbed = new qx.ui.embed.Html();
                    control.set({ padding: 5, overflowX: 'auto', overflowY: 'auto' });

                    this._add(control, { flex: 3 });
                    break;
            }

            return control || this.base(arguments, id);
        },

        _setContent: function (customData) {
            var content = this.getSettings().content;

            if (qx.lang.Type.isArray(content)) content = content.join('\n');

            this.__htmlEmbed.setHtml(this.__showdownConverter.makeHtml(qx.bom.Template.render(content, customData)))
        },

        /**
         * Fired when changed selection of component items.
         *
         * @param data {Object} Selected item data.
         */
        onSelectionChange: function (data) {
            if (data.customData) this._setContent(data.customData.item);
        }
    }
});