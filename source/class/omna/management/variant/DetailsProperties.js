qx.Class.define('omna.management.variant.DetailsProperties', {
  extend: omna.management.product.DetailsProperties,

  statics: {
    detailsPropertiesClass: omna.form.variant.DetailsProperties,
    managementId: 'VariantsDetails',
    itemAttr: 'variant'
  },

  members: {
    _notifyNoProperties: function () {
      this.info('NO-VARIANT-PROPERTIES');
    }
  }
});