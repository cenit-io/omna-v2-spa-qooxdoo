qx.Class.define("omna.request.Products", {
  extend: omna.request.AbstractResource,

  construct: function () {
    this.base(arguments, 'products');
  },

  members: {
    link: function (id, data, callBack, scope) {
      // Call remote service
      this.submit("PUT", id, { data: data }, callBack, scope);
    },

    unLink: function (id, data, callBack, scope) {
      // Call remote service
      this.submit("PATCH", id, { data: data }, callBack, scope);
    },

    updateProperties: function (integration, properties, callBack, scope) {
      let path = '/integrations/{{id}}/products/{{product.remote_product_id}}';

      path = qx.bom.Template.render(path, integration);

      this.submit("POST", path, { data: { properties: properties } }, callBack, scope);
    }
  }
});
