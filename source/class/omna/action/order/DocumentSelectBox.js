/**
 * @asset(omna/icon/16/actions/document_down.png)
 */
qx.Class.define('omna.action.order.DocumentSelectBox', {
    extend: qx.ui.form.SelectBox,

    construct: function (order) {
        this.base(arguments);
        this.setWidth(200);
    },

    properties: {
        order: {
            check: 'Object',
            apply: '__applyOrder'
        }
    },

    members: {
        __applyOrder: function (currentValue, previousValue) {
            if (!previousValue || previousValue.integration.channel !== currentValue.integration.channel) {
                var request = new omna.request.Orders();

                this.getChildrenContainer().removeAll();

                request.getOrderDocTypes(currentValue, function (response) {
                    if (response.successful) {
                        response.data.forEach(function (item) {
                            this.add(
                                new qx.ui.form.ListItem(item.title, 'omna/icon/16/actions/document_down.png', item)
                            );
                        }, this);
                    }
                }, this);
            } else {
                this.fireDataEvent('changeSelection', this.getSelection())
            }
        }
    }
});
