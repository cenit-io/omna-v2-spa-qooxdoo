qx.Class.define("omna.management.variant.Details", {
  extend: omna.management.product.Details,

  statics: {
    detailsGeneralClass: omna.management.variant.DetailsGeneral,
    detailsPropertiesClass: omna.management.variant.DetailsProperties,
    requestManagementClass: omna.request.Variants,
    managementId: 'VariantsDetails',
    propertiesDefaultValues: qx.lang.Object.mergeWith(
      {}, omna.management.AbstractManagement.propertiesDefaultValues, false
    )
  },

  members: {
    _setLocalItemId: function (integration, item) {
      integration[this.constructor.detailsPropertiesClass.itemAttr].local_product_id = item.product.id
      integration[this.constructor.detailsPropertiesClass.itemAttr].local_variant_id = item.id
    }
  }
});