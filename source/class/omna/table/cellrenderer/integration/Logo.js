qx.Class.define("omna.table.cellrenderer.integration.Logo", {
    extend: qx.ui.table.cellrenderer.Image,
    include: omna.mixin.MChannel,

    members: {
        // overridden
        _identifyImage: function (cellInfo) {
            var icon = cellInfo.value,
                imageHints = { imageWidth: 24, imageHeight: 24 };

            imageHints.url = (icon === "" || icon === null) ? null : this.__am.resolve(this.channelIcon(icon));
            imageHints.tooltip = cellInfo.value;

            return imageHints;
        }
    }
});