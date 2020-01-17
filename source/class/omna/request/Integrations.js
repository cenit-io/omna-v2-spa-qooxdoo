qx.Class.define("omna.request.Integrations", {
    extend: omna.request.AbstractResource,

    construct: function () {
        this.base(arguments, 'integrations/available');
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