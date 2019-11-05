/* ************************************************************************

 Copyright:

 License:

 Authors:

 ************************************************************************ */

/**
 * This is the main application class of your custom application "omna-gui"
 *
 * @require(qx.module.Messaging)
 *
 * @asset(omna/libs/*)
 * @asset(omna/settings/*)
 * @asset(omna/templates/*)
 * @asset(omna/icon/24/integrations/*)
 */
qx.Class.define("omna.Application", {
    extend: qx.application.Standalone,
    include: [omna.mixin.MComponents, omna.mixin.MSettings],

    construct: function () {
        this.base(arguments);
        this.loadSettings('Application');
    },

    properties: {
        serverBaseUrl: {
            init: null
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
            var qTitle = document.getElementsByTagName('title')[0];
            if (qTitle) qTitle.innerText = omna.I18n.trans('APPLICATION-TITLE');

            this.__disableHistory();
        },

        __applyLocale: function (v) {
            qx.locale.Manager.getInstance().setLocale(v);
        },

        /**
         * Disable navigator history.
         */
        __disableHistory: function () {
            window.onhashchange = function () {
                // It works without the History API, but will clutter up the history
                history.pushState ? history.pushState(null, '', '#HOFF') : location.hash = '#HOFF'
            };
            window.onhashchange();
        },

        /**
         * Crate layouts
         *
         * @private
         */
        __doLayouts: function () {
            var root = this.getRoot();

            root.setBlockerOpacity(0.6);
            root.setBlockerColor("black");

            // Create main layout
            var dockLayout = new qx.ui.layout.Dock(),
                dockLayoutComposite = new qx.ui.container.Composite(dockLayout);

            dockLayout.setSort("y");
            root.add(dockLayoutComposite, { edge: 0 });

            // Create header
            this.__headerBox = omna.layout.Header.getInstance();
            dockLayoutComposite.add(this.__headerBox, { edge: "north" });

            // Create horizontal splitpane for left, main and right boxs
            var mainBoxWidth = qx.bom.Viewport.getWidth(),
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