qx.Class.define("omna.table.cellrenderer.integration.Logo", {
    extend: qx.ui.table.cellrenderer.Image,

    members: {
        // overridden
        _identifyImage: function (cellInfo) {
            var icon = cellInfo.value,
                imageHints = { imageWidth: 24, imageHeight: 24 };

            if (icon === "" || icon === null) {
                imageHints.url = null;
            } else {
                icon = "omna/icon/24/integrations/" + icon.replace(/[A-Z]{2}$/, '') + ".png";
                imageHints.url = this.__am.resolve(icon);
            }

            imageHints.tooltip = cellInfo.value;

            return imageHints;
        }
    }
});