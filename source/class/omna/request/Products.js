qx.Class.define("omna.request.Products", {
    extend: omna.request.AbstractResource,

    construct: function () {
        this.base(arguments, 'products');
    }
});
