/* ************************************************************************

 Copyright:

 License:

 Authors:

 ************************************************************************ */

/**
 * Here you documentation for you class
 *
 * @asset(omna/icon/24/actions/logout.png)
 * @asset(omna/images/loading.gif)
 * @asset(omna/images/favicon.png)
 * @asset(omna/images/logo.png)
 */
qx.Class.define("omna.layout.Header", {
    type: "singleton",
    extend: qx.ui.container.Composite,

    /**
     * Constructor
     */
    construct: function () {
        this.base(arguments);

        this.setLayout(new qx.ui.layout.HBox(0));
        this.setAppearance("app-header");

        var logo = new qx.ui.basic.Image("omna/images/logo.png"),
            logout = new qx.ui.menubar.Button(null, "omna/icon/24/actions/logout.png"),
            profile = omna.request.Session.getProfile() || {};

        this.__searchField = new omna.form.field.util.SearchTextField();
        this.__user = new qx.ui.basic.Label(profile.name || "-");
        this.__user.setAppearance('profile');

        this.__loading = new qx.ui.basic.Image("omna/images/loading.gif");
        this.__loading.hide();

        this.add(logo);
        this.add(new qx.ui.core.Spacer, { flex: 1 });
        this.add(this.__loading);
        this.add(this.__searchField);
        this.add(this.__user);
        this.add(logout);

        this.__searchField.setAppearance('global-search-text-field');
        this.__searchField.addListener("changeValue", this.onGlobalSearchChangeValue, this);

        logout.addListener("click", function () {
            q.messaging.emit("Application", "logout");
        }, this);

        // Create route handler for messaging channels.
        q.messaging.on("Application", "update-session", this.onUpdateSession, this);
        q.messaging.on("Application", "change-active-module", this.onChangeActiveModule, this);
        q.messaging.on("Application", "loading-start", this.onLoaddingStart, this);
        q.messaging.on("Application", "loading-release", this.onLoaddingRelease, this);
    },

    members: {
        __user: null,
        __activeModule: null,
        __loadingStatus: 0,

        onLoaddingStart: function () {
            if (this.__loadingStatus === 0) this.__loading.show();
            this.__loadingStatus++;
        },

        onLoaddingRelease: function () {
            this.__loadingStatus = Math.max(0, this.__loadingStatus - 1);
            if (this.__loadingStatus === 0) this.__loading.hide();
        },

        /**
         * Execute when user login or logout.
         * Update application header with login user profile data.
         *
         * @param data {Object} Login or logout data.
         */
        onUpdateSession: function (data) {
            this.__user.setValue(data.params.action == "login" ? (data.params.profile.name || '-') : "-");
        },

        /**
         * Execute when switched tab module.
         *
         * @param data {Object} Active tab module reference.
         */
        onChangeActiveModule: function (data) {
            if (data.params instanceof omna.management.Page) {
                this.__activeModule = data.params;
                this.__searchField.setValue(this.__activeModule.getGlobalSearchText());
            } else {
                this.__activeModule = null;
                this.__searchField.setValue('');
            }
        },

        /**
         * Fired when the global search field change.
         *
         * @param e {qx.event.type.Data}
         */
        onGlobalSearchChangeValue: function (e) {
            if (this.__activeModule) {
                this.__activeModule.getChildren().forEach(function (component) {
                    component.emitMessaging && component.emitMessaging("execute-global-search", e.getTarget().getValue());
                }, this)
            }
        }
    }
});
