/**
 * @asset(omna/icon/16/actions/variants.png)
 */
qx.Class.define('omna.action.product.Variants', {
    extend: omna.action.AbstractActionWithSelectedItem,

    construct: function (management) {
        this.base(arguments, management, 'variants', 'omna/icon/16/actions/variants.png');

        this.addMessagingListener("open-variants", this.onOpenVariants);
    },

    members: {
        onExecute: function () {
            this.emitMessaging("open-variants", { item: this.getSelectedItem(), index: this.getSelectedIndex() });
        },

        onOpenVariants: function (data) {
            var data = data.customData,
                module = { id: 'Variants', i18n: this.getI18nCatalog() };

            data.label = this.i18nTrans('MODULE-REFERENCE-VARIANTS', data.item);
            data.params = { product_id: data.item.id };

            q.messaging.emit('Application', 'open-module', module, data);
        }
    }
});
