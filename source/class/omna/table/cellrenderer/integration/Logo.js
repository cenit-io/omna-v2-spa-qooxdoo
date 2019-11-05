qx.Class.define("omna.table.cellrenderer.integration.Logo", {
    extend: qx.ui.table.cellrenderer.Image,

    members: {
        // overridden
        _identifyImage: function (cellInfo) {
            var path = cellInfo.value,
                imageHints = { imageWidth: 24, imageHeight: 24 };

            if (path === "" || path === null) {
                imageHints.url = null;
            } else {
                path = path.replace(/[A-Z]{2}$/, '');
                path = 'omna/icon/24/integrations/' + path + '.png';

                imageHints.url = this.__am.resolve(path);
            }

            imageHints.tooltip = cellInfo.value;

            return imageHints;
        }
    }
});