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
  }
});