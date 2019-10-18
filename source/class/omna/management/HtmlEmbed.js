/**
 * @childControl title {qx.ui.basic.Atom} Title component properties panel.
 * @childControl scrollPanel {qx.ui.container.Scroll} Scroll component properties panel.
 * @childControl iFrame {qx.ui.embed.Html} show the html of the content.
 * @ignore(showdown.*)
 */
qx.Class.define("omna.management.HtmlEmbed", {
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
            var control;

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
            var contentTemplate = this.getContentTemplate(),
                document = this.__documentIFrame ? this.__documentIFrame.getContentElement().getDocument() : null;

            if (!document) return setTimeout(qx.lang.Function.bind(this._setContent, this), 5, data);

            if (qx.lang.Type.isArray(contentTemplate)) contentTemplate = contentTemplate.join('\n');

            document.open();
            document.write(qx.bom.Template.render(contentTemplate, data));
            document.close();
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
            var iframe = this.__documentIFrame.getContentElement().getDomElement();
            iframe.focus();
            iframe.contentWindow.print();
        },

        onChangeCustomData: function (e) {
            var data = e.getData();

            this._setContent(data);
        }
    }
});