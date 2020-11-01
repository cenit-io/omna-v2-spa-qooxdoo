qx.Class.define("omna.table.cellrenderer.Number", {
  extend: qx.ui.table.cellrenderer.Number,

  /**
   * Constructor
   *
   * @param settings {Map} Settings to apply to the cell renderer.
   * <pre class='javascript'>
   *     new omna.table.cellrenderer.Number({
   *          gridRendererStyle: {
   *              aling: "center",
   *              color: "red",
   *              fontStyle: "italic",
   *              fontWeight: "bold"
   *          },
   *          numberFormat: "##.###"
   *     })
   * </pre>
   */
  construct: function (settings) {
    settings.gridRendererStyle = settings.gridRendererStyle || {};

    this.base(arguments,
      settings.gridRendererStyle.textAlign || 'right',
      settings.gridRendererStyle.textColor,
      settings.gridRendererStyle.fontStyle,
      settings.gridRendererStyle.fontWeight
    );

    this.setNumberFormat(new qx.util.format.NumberFormat);

    this.set({
      maximumFractionDigits: settings.maximumFractionDigits || 2,
      minimumFractionDigits: settings.minimumFractionDigits || 0,
      postfix: settings.postfix || null,
      prefix: settings.prefix || null
    })
  },

  properties: {
    maximumFractionDigits: {
      check: 'Number',
      apply: '_applyMaximumFraction'
    },

    minimumFractionDigits: {
      check: 'Number',
      apply: '_applyMinimumFraction'
    },

    postfix: {
      check: 'String',
      nullable: true,
      apply: '_applyPostfix'
    },

    prefix: {
      check: 'String',
      nullable: true,
      apply: '_applyPrefix'
    }
  },

  members: {
    _applyMaximumFraction: function (value) {
      this.getNumberFormat().setMaximumFractionDigits(value);
    },

    _applyMinimumFraction: function (value) {
      this.getNumberFormat().setMinimumFractionDigits(value);
    },

    _applyPostfix: function (value) {
      this.getNumberFormat().setPostfix(value || "");
    },

    _applyPrefix: function (value) {
      this.getNumberFormat().setPrefix(value || "");
    }
  }
});
