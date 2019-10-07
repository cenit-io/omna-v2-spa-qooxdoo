/**
 * @asset(omna/icon/32/info.png)
 * @asset(omna/icon/32/error.png)
 */
qx.Class.define("omna.management.order.Documents", {
    extend: omna.management.AbstractManagement,

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

        this.__createContent(customData);
        this.__documentSelectBox.setOrder(customData.order);

        this.addMessagingListener("execute-print", this.onExecutePrint);
    },

    members: {
        getActions: function () {
            var a1 = new qx.ui.basic.Label(this.i18nTrans('select_document_type')),
                a2 = this.__documentSelectBox = new omna.action.order.DocumentSelectBox(),
                a3 = this.__documentPrint = new omna.action.order.Print(this);

            a1.set({ padding: [2, 5], decorator: 'main' });

            this.__documentSelectBox.addListener("changeSelection", this.onDocumentChangeSelection, this);

            return [a1, a2, a3];
        },

        __createContent: function (customData) {
            this.__docuemnetTip = new qx.ui.tooltip.ToolTip();
            this.__docuemnetFrame = new qx.ui.embed.Iframe();

            this.__docuemnetTip.set({ textColor: 'black', autoHide: false, maxHeight: 70 });
            this.__docuemnetFrame.set({ padding: 10 });

            this.add(this.__docuemnetTip, { flex: 2 });
            this.add(this.__docuemnetFrame, { flex: 2 });
        },

        __createObjectURL: function (data) {
            var file = qx.util.Base64.decode(data.file),
                contentType = data.mime_type,
                blod = new Blob([file], { type: contentType }),
                objUrl = window.URL.createObjectURL(blod);

            return objUrl;
        },

        onChangeCustomData: function (e) {
            this.__documentSelectBox.setOrder(this.getCustomData().order);
        },

        onDocumentChangeSelection: function (e) {
            var data = e.getData();

            this.__docuemnetTip.set({ label: 'Loading...', icon: 'omna/icon/32/info.png', backgroundColor: 'info' });
            this.__docuemnetTip.show();
            this.__docuemnetFrame.set({ source: 'about:blank' });

            if (data.length !== 0) {
                var order = this.getCustomData().order,
                    docType = data[0].getModel().type,
                    request = new omna.request.Orders();

                request.getOrderDoc(order, docType, function (response) {
                    if (response.successful) {
                        this.__docuemnetTip.exclude();
                        this.__docuemnetFrame.set({ source: this.__createObjectURL(response.data) });
                    } else {
                        this.__docuemnetTip.set({
                            label: response.message, icon: 'omna/icon/32/warn.png', backgroundColor: 'warn'
                        });
                        this.__docuemnetTip.show();
                    }
                }, this);
            }
        },

        onExecutePrint: function () {
            var iframe = this.__docuemnetFrame.getContentElement().getDomElement();
            iframe.focus();
            iframe.contentWindow.print();
        }
    }
});
