qx.Class.define("omna.table.cellrenderer.Date", {
  extend: qx.ui.table.cellrenderer.Date,

  /**
   * Constructor
   *
   * @param settings {Map} Settings to apply to the cell renderer.
   * <pre class='javascript'>
   *     new omna.table.cellrenderer.Date({
   *          gridRendererStyle: {
   *              aling: "center",
   *              color: "red",
   *              fontStyle: "italic",
   *              fontWeight: "bold"
   *          },
   *          strDateFormat: "YYYY-MM-dd HH:mm:ss"
   *     })
   * </pre>
   */
  construct: function (settings) {
    settings = settings || {};

    let rendererStyle = settings.gridRendererStyle || {};

    this.base(arguments,
      rendererStyle.textAlign || 'center',
      rendererStyle.textColor,
      rendererStyle.fontStyle,
      rendererStyle.fontWeight
    );

    this.setDateFormat(new qx.util.format.DateFormat(settings.strDateFormat || 'YYYY-MM-dd HH:mm:ss'));
  },

  members: {
    // overridden
    _getContentHtml: function (cellInfo) {
      if (qx.lang.Type.isString(cellInfo.value)) cellInfo.value = new Date(cellInfo.value);

      return this.base(arguments, cellInfo)
    }
  }
});
