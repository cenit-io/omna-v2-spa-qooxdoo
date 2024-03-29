qx.Class.define("omna.request.Variants", {
  extend: omna.request.AbstractResource,

  construct: function () {
    this.base(arguments, 'products/{product_id}/variants');
  },

  members: {
    link: function (id, data, callBack, scope) {
      // Call remote service
      this.submit("PUT", `${id}/link`, { data: data }, callBack, scope);
    },

    unLink: function (id, data, callBack, scope) {
      // Call remote service
      this.submit("DELETE", `${id}/link`, { data: data }, callBack, scope);
    },

    updateProperties: function (integration, properties, callBack, scope) {
      let path = '/integrations/{{id}}/products/{{variant.local_product_id}}/variants/{{variant.local_variant_id}}';

      path = qx.bom.Template.render(path, integration);

      this.submit("POST", path, { data: { properties: properties } }, callBack, scope);
    }
  }
});
