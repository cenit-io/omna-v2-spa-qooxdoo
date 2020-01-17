qx.Class.define("omna.request.Collections", {
    extend: omna.request.AbstractResource,

    construct: function () {
        this.base(arguments, 'collections');
    },

    members: {
        install: function (id) {
            alert('TODO:..')
        },

        uninstall: function (id, callBack, scope) {
            alert('TODO:..')
        }
    }
});