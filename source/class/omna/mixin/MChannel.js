qx.Mixin.define('omna.mixin.MChannel', {
    members: {
        channelIcon: function (name) {
            return 'omna/icon/24/integrations/' + name.replace(/^Ov2|[A-Z]{2}$/g, '') + '.png'
        }
    }
});
