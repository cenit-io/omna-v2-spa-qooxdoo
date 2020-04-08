qx.Class.define("omna.action.product.IntegrationsAbstractLink", {
    type: 'abstract',
    extend: omna.action.AbstractActionWithSelectedItem,
    include: [omna.mixin.MActionWithDlg],

    members: {
        _doRequest: function (action, itemId, itemLabel, params, done) {
            if (params.integration_ids.length === 0) return done.call(this);

            var request = this.getManagement().getRequestManagement();

            request[action](itemId, params, function (response) {
                if (response.successful) {
                    this.good('SUCCESSFUL-' + action.toUpperCase(), [itemLabel]);
                    done && done.call(this, response);
                } else {
                    this.error('FAILED-' + action.toUpperCase(), [itemLabel]);
                }
            }, this);
        }
    }
});
