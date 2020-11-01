qx.Class.define("omna.table.cellrenderer.Logo", {
  extend: qx.ui.table.cellrenderer.Image,
  include: omna.mixin.MLogo,

  members: {
    // overridden
    _identifyImage: function (cellInfo) {
      let icon = cellInfo.value,
        imageHints = { imageWidth: 24, imageHeight: 24 };

      imageHints.url = (icon === "" || icon === null) ? null : this.__am.resolve(this.integrationLogo(icon));
      imageHints.tooltip = cellInfo.value;

      return imageHints;
    }
  }
});