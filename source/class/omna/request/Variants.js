qx.Class.define("omna.request.Variants", {
    extend: omna.request.AbstractResource,

    construct: function () {
        this.base(arguments, 'products/{product_id}/variants');
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

        updateProperties: function (integration_id, remote_variant_id, properties, callBack, scope) {
            var path = '/integrations/' + integration_id + '/variants/' + remote_variant_id;

            this.submit("POST", path, { data: { properties: properties } }, callBack, scope);
        }
    }
});
