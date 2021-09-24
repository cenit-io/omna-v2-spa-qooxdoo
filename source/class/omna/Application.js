/* ************************************************************************

 Copyright:

 License:

 Authors:

 ************************************************************************ */

/**
 * This is the main application class of your custom application "omna-v2-spa-qooxdoo"
 *
 * @require(qx.module.Messaging)
 *
 * @asset(omna/libs/*)
 * @asset(omna/settings/*)
 * @asset(omna/templates/*)
 * @asset(omna/icon/24/logos/*)
 */
qx.Class.define("omna.Application", {
  extend: qx.application.Standalone,
  include: [omna.mixin.MSettings],

  construct: function () {
    this.base(arguments);
    this.loadSettings('Application');
  },

  properties: {
    serverBaseURLs: {
      init: {},
    },

    api: {
      check: 'String',
      init: 'ecapi-v1'
    },

    locale: {
      check: 'String',
      apply: '__applyLocale'
    }
  },

  members: {
    __toolTipTemplate: "<span title='{{localization}}'>{{description}}</span>",

    /**
     * This method contains the initial application code and gets called
     * during startup of the application
     *
     * @lint ignoreDeprecated(alert)
     */
    main: function () {
      // Call super class
      this.base(arguments);

      // Enable logging in debug variant
      if (qx.core.Environment.get("qx.debug")) {
        // support native logging capabilities, e.g. Firebug for Firefox
        qx.log.appender.Native;
        // support additional cross-browser console. Press F7 to toggle visibility
        qx.log.appender.Console;
      }

      if (omna.request.Session.isAuthenticated()) {
        this.__doLayouts();
      } else {
        omna.request.Session.getInstance().login();
      }

      // Create route handler for messaging channels.
      q.messaging.on("Application", "info", this.onTipInformation, this);
      q.messaging.on("Application", "good", this.onTipGood, this);
      q.messaging.on("Application", "notice", this.onTipGood, this);
      q.messaging.on("Application", "warn", this.onTipWarning, this);
      q.messaging.on("Application", "warning", this.onTipWarning, this);
      q.messaging.on("Application", "error", this.onTipError, this);

      // Set application title in html page.
      let qTitle = document.getElementsByTagName('title')[0];
      if (qTitle) qTitle.innerText = omna.I18n.trans('APPLICATION-TITLE');
    },

    /**
     * Check if the application is under development.
     *
     * @return {Boolean}
     * @ignore(__filename)
     */
    itIsDeveloping: function () {
      return String(__filename).match(/source\/class\/guaraiba\/Application.js$/);
    },

    __applyLocale: function (v) {
      qx.locale.Manager.getInstance().setLocale(v);
    },

    /**
     * Crate layouts
     *
     * @private
     */
    __doLayouts: function () {
      let root = this.getRoot();

      root.setBlockerOpacity(0.6);
      root.setBlockerColor("black");

      // Create main layout
      let dockLayout = new qx.ui.layout.Dock(),
        dockLayoutComposite = new qx.ui.container.Composite(dockLayout);

      dockLayout.setSort("y");
      root.add(dockLayoutComposite, { edge: 0 });

      // Create header
      this.__headerBox = omna.layout.Header.getInstance();
      dockLayoutComposite.add(this.__headerBox, { edge: "north" });

      // Create horizontal splitpane for left, main and right boxs
      let mainBoxWidth = qx.bom.Viewport.getWidth(),
        leftSplitPane = new qx.ui.splitpane.Pane();

      dockLayoutComposite.add(leftSplitPane, { edge: "center" });

      // Create left box
      this.__leftBox = omna.layout.LeftBox.getInstance();
      leftSplitPane.add(this.__leftBox, 0);
      mainBoxWidth -= this.__leftBox.getWidth();

      // Create main box
      this.__mainBox = omna.layout.MainBox.getInstance();
      leftSplitPane.add(this.__mainBox, 1);

      this.__mainBox.setWidth(mainBoxWidth);

      // Create footer box
      this.__footerBox = omna.layout.Footer.getInstance();
      dockLayoutComposite.add(this.__footerBox, { edge: "south" });
    },

    /**
     * Returns names of given classes.
     *
     * @param componentClasses {Array|Class|String}
     * @return {Array}
     * @internal
     */
    __classesToStrings: function (componentClasses) {
      componentClasses = qx.lang.Type.isArray(componentClasses) ? componentClasses : [componentClasses];
      return componentClasses.map(function (c) {
        return qx.lang.Type.isString(c) ? c : c.classname
      })
    },

    /**
     * Register new resource uri.
     *
     * @param namespace {String} Resources namespace.
     * @param resourcePath {String} Path to resources.
     */
    registerResourceUri: function (namespace, resourcePath) {
      // Set base path for namespace resources.
      qx.util.LibraryManager.getInstance().set(namespace, "resourceUri", resourcePath);
    },

    getServerBaseUrl: function () {
      const queryParams = window.location.search;
      const urlParams = new URLSearchParams(queryParams);
      const serverBaseURLs = this.getServerBaseURLs();
      const m = window.location.href.match(/https?:\/\/([\w-]+|127\.0\.0\.1)/);

      let baseUrlId = urlParams.get('sId');

      if (!baseUrlId) baseUrlId = m ? m[1] : 'passer-prod';
      if (baseUrlId.match(/^(localhost|127\.0\.0\.1)/)) baseUrlId = 'passer-dev';

      return serverBaseURLs[baseUrlId];
    },

    __parseToolTipMsg: function (msg) {
      return qx.lang.Type.isString(msg) ? msg : qx.bom.Template.render(this.__toolTipTemplate, msg);
    },

    getToolTioPlaceToWidget: function () {
      return this.__headerBox || this.__mainBox || this.getRoot();
    },

    onTipInformation: function (data) {
      omna.ToolTip.info(this.__parseToolTipMsg(data.params));
    },

    onTipGood: function (data) {
      omna.ToolTip.good(this.__parseToolTipMsg(data.params));
    },

    onTipWarning: function (data) {
      omna.ToolTip.warn(this.__parseToolTipMsg(data.params));
    },

    onTipError: function (data) {
      omna.ToolTip.error(this.__parseToolTipMsg(data.params));
    }
  }

  // defer: function () {
  //     qx.bom.Event.preventDefault = function (e) {
  //         if (e.preventDefault) {
  //             return false
  //         }
  //         else {
  //             try {
  //                 // this allows us to prevent some key press events in IE.
  //                 // See bug #1049
  //                 e.keyCode = 0;
  //             } catch ( ex ) {
  //             }
  //
  //             e.returnValue = false;
  //         }
  //     }
  // }
});