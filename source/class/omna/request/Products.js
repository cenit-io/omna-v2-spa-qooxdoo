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

        updateProperties: function (integration_id, remote_product_id, properties, callBack, scope) {
            let path = '/integrations/' + integration_id + '/products/' + remote_product_id;

            this.submit("POST", path, { data: { properties: properties } }, callBack, scope);
        }
    }
});
