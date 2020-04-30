/**
 * @childControl title {qx.ui.basic.Atom} Title component properties panel.
 * @childControl scrollPanel {qx.ui.container.Scroll} Scroll component properties panel.
 * @childControl iFrame {qx.ui.embed.Html} show the html of the content.
 */
qx.Class.define("omna.management.HtmlEmbed", {
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
        this._createChildControlImpl('iFrame');

        if (settings.listenFromComponentId) {
            this.addMessagingListener('selection-change', this.onSelectionChange, settings.listenFromComponentId)
        }

        this.addMessagingListener("execute-print", this.onExecutePrint);
    },

    properties: {
        contentTemplate: {
            init: ''
        }
    },

    members: {
        // overridden
        _createChildControlImpl: function (id, hash) {
            let control;

            switch ( id ) {
                case "title":
                    control = new qx.ui.basic.Atom(this.i18nTrans(this.getSettings().title));
                    control.setMaxHeight(27);
                    this._add(control, { flex: 2 });
                    break;

                case "iFrame":
                    control = this.__documentIFrame = new qx.ui.embed.Iframe();
                    control.set({ padding: 0, decorator: 'none' });

                    this._add(control, { flex: 3 });
                    break;
            }

            return control || this.base(arguments, id);
        },

        _setContent: function (data) {
            let contentTemplate = this.getContentTemplate(),
                document = this.__documentIFrame ? this.__documentIFrame.getContentElement().getDocument() : null,
                content;

            if (!document) return setTimeout(qx.lang.Function.bind(this._setContent, this), 5, data);

            if (qx.lang.Type.isArray(contentTemplate)) contentTemplate = contentTemplate.join('\n');

            content = qx.bom.Template.render(contentTemplate, data)

            if (content.match(/^(https?:\/\/)(\w[\w-]+)(\.\w[\w-]+)*(\.[a-z]{2,3})([\/?#].*)?$/)) {
                this.__documentIFrame.set({ source: content });
            } else {
                document.open();
                document.write(content);
                document.close();
            }
        },

        /**
         * Fired when changed selection of component items.
         *
         * @param data {Object} Selected item data.
         */
        onSelectionChange: function (data) {
            if (data.customData) this._setContent(data.customData.item);
        },

        onExecutePrint: function () {
            let iframe = this.__documentIFrame.getContentElement().getDomElement();
            iframe.focus();
            iframe.contentWindow.print();
        },

        onChangeCustomData: function (e) {
            let data = e.getData();

            this._setContent(data);
        }
    }
});