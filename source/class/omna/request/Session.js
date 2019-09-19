qx.Class.define("omna.request.Session", {
    type: "singleton",
    extend: qx.core.Object,
    include: [qx.locale.MTranslation],

    statics: {
        getCredentials: function () {
            return omna.request.Session.getInstance().getCredentials();
        },

        getProfile: function () {
            return omna.request.Session.getInstance().getProfile();
        },

        isAuthenticated: function () {
            return omna.request.Session.getInstance().isAuthenticated();
        }
    },

    // override
    construct: function () {
        this.base(arguments);

        // Create route handler for messaging channels.
        q.messaging.on("Application", "logout", this.logout, this);
        q.messaging.on("Application", "login", this.login, this);
    },

    members: {

        getServerBaseUrl: function () {
            return qx.core.Init.getApplication().getServerBaseUrl();
        },

        getAppBaseUrl: function () {
            return qx.util.Uri.getAbsolute('').replace(/[\?#].*/, '');
        },

        getCredentials: function () {
            var profile = this.getProfile();
            return { token: profile.token, secret: profile.secret }
        },

        /**
         * Clear authenticity profile and open login dialog.
         */
        login: function () {
            this.setProfile(null);

            var params = qx.util.Uri.parseUri(window.location.href),
                serverBaseUrl = this.getServerBaseUrl(),
                appUrl = this.getAppBaseUrl();

            if (params.queryKey.code) {
                var request = new qx.io.request.Xhr(serverBaseUrl + '/get_access_token', 'POST');

                request.setRequestData({ code: params.queryKey.code });
                request.setRequestHeader("Accept", "application/json");
                request.addListenerOnce("success", this.onLoginSuccess, this);
                request.addListenerOnce("statusError", this.onLoginStatusError, this);
                request.addListenerOnce("error", this.onError, this);

                request.send();
            } else {
                window.location = serverBaseUrl + '/sign_in?redirect_uri=' + appUrl
            }
        },

        /**
         * Send request to report server to check the authenticity
         * for release active authenticity token.
         *
         * The response will be processed in the events methods onSuccess or onError.
         */
        logout: function () {
            this.setProfile(null);

            var serverBaseUrl = this.getServerBaseUrl(),
                appUrl = this.getAppBaseUrl();

            window.location = serverBaseUrl + '/sign_out?redirect_uri=' + appUrl;
        },

        isAuthenticated: function () {
            return this.getProfile() != null;
        },

        setProfile: function (value) {
            if (value == null) {
                // Clean local session.
                qx.module.Storage.clearSession();
            } else {
                qx.module.Storage.setSessionItem('profile', value);
            }
        },

        getProfile: function () {
            return qx.module.Storage.getSessionItem('profile');
        },

        /**
         * Fired when request completes without error and transport’s status indicates success.
         */
        onLoginSuccess: function (e) {
            var response = e.getTarget().getResponse();

            this.setProfile(response.data);

            q.messaging.emit("Application", "good", this.tr("Successful login"));
            q.messaging.emit("Application", "update-session", { action: "login", profile: response });
        },

        /**
         * Fired when request completes without error but erroneous HTTP status.
         */
        onLoginStatusError: function (e) {
            // Delete the local registry of the current authenticity profile.
            this.setProfile(null);

            var response = e.getTarget().getResponse(),
                status = response.statusCode || e.getTarget().getStatus(),
                msg = response.error.message
                    || response.message
                    || omna.request.AbstractResource.HttpStatus(status);

            q.messaging.emit("Application", "error", msg);
        },

        /**
         * Process the failed response from login or requests.
         */
        onError: function (e) {
            // Delete the local registry of the current authenticity profile.
            this.setProfile(null);
            q.messaging.emit("Application", "error", this.tr("Failed connection with server."));
        }
    }
});
