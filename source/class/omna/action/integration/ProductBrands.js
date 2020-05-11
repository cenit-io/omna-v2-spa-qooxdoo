/**
 * @asset(omna/icon/16/actions/variants.png)
 */
qx.Class.define('omna.action.integration.ProductBrands', {
    extend: omna.action.AbstractActionWithSelectedItem,

    construct: function (management) {
        this.base(arguments, management, 'brands', 'omna/icon/16/actions/variants.png');
    },

    members: {
        onExecute: function () {
            let module = { id: 'ProductBrands', i18n: this.getI18nCatalog() },
                item = this.getSelectedItem(),

                data = {
                    item: this.getSelectedItem(),
                    label: this.i18nTrans('MODULE-REFERENCE-BRANDS', item),
                    params: { integration_id: item.id }
                };

            q.messaging.emit('Application', 'open-module', module, data);
        }
    }
});
