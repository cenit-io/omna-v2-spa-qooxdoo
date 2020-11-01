/* ************************************************************************

 Copyright:

 License:

 Authors:

 ************************************************************************ */

/**
 * Here you documentation for you class
 *
 */
qx.Class.define("omna.layout.Footer", {
  type: "singleton",
  extend: qx.ui.container.Composite,

  /**
   * Constructor
   */
  construct: function () {
    this.base(arguments);

    this.setLayout(new qx.ui.layout.HBox);
    this.setAppearance("app-footer");

    this.add(new qx.ui.basic.Label(omna.I18n.trans('copyright')));
    this.add(new qx.ui.core.Spacer, { flex: 1 });
    this.add(new qx.ui.basic.Label(omna.I18n.trans('Messages', 'copyright-company')));
  }
});
