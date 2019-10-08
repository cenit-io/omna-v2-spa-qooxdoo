qx.Class.define("omna.request.Products", {
    extend: omna.request.AbstractResource,

    construct: function () {
        this.base(arguments, 'products');
    },

    members: {
        publish: function (id, data, callBack, scope) {
            // Call remote service
            this.submit("PUT", id, { data: data }, callBack, scope);
        },

        unPublish: function (id, data, callBack, scope) {
            // Call remote service
            this.submit("DELETE", id, { data: data }, callBack, scope);
        }
    }
});
