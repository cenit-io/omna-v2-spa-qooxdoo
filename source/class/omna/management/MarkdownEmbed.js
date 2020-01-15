/**
 * @childControl title {qx.ui.basic.Atom} Title component properties panel.
 * @childControl scrollPanel {qx.ui.container.Scroll} Scroll component properties panel.
 * @childControl htmlEmbed {qx.ui.embed.Html} show the html of the content.
 */
qx.Class.define("omna.management.MarkdownEmbed", {
    extend: omna.management.AbstractManagement,

    statics: {
        propertiesDefaultValues: qx.lang.Object.mergeWith(
            { content: '' },
            omna.management.AbstractManagement.propertiesDefaultValues, false
        )
    },

    // override
    construct: function (settings, customData, modulePage) {
        this.base(arguments, settings, customData, modulePage);

        this.set({ appearance: 'management', contentTemplate: settings.content || '' });

        if (settings.title) this._createChildControl("title");
        this._createChildControlImpl('htmlEmbed');

        var listenFromComponentId = settings.listenFromComponentId;

        if (listenFromComponentId) {
            this.addMessagingListener('selection-change', this.onSelectionChange, listenFromComponentId)
        } else {
            this._setContent(customData)
        }
    },

    properties: {
        contentTemplate: {
            init: ''
        }
    },

    members: {
        // overridden
        _createChildControlImpl: function (id, hash) {
            var control;

            switch ( id ) {
                case "title":
                    control = new qx.ui.basic.Atom(this.i18nTrans(this.getSettings().title));
                    control.setMaxHeight(27);
                    this._add(control, { flex: 2 });
                    break;

                case "htmlEmbed":
                    this.__showdownConverter = new showdown.Converter({ tables: true });

                    control = this.__htmlEmbed = new qx.ui.embed.Html();
                    control.set({ padding: 5, overflowX: 'auto', overflowY: 'auto' });

                    this._add(control, { flex: 3 });
                    break;
            }

            return control || this.base(arguments, id);
        },

        _setContent: function (item) {
            var contentTemplate = this.getContentTemplate();

            if (qx.lang.Type.isArray(contentTemplate)) contentTemplate = contentTemplate.join('\n');

            this.__htmlEmbed.setHtml(
                this.__showdownConverter.makeHtml(
                    qx.bom.Template.render(contentTemplate, item)
                )
            )
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