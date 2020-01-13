qx.Class.define("omna.action.AbstractAction", {
    type: 'abstract',
    extend: qx.ui.form.Button,
    include: [omna.mixin.MI18n],
    implement: [omna.mixin.II18n],

    construct: function (management, label, icon) {
        // Create and configure the command
        var command = new qx.ui.command.Command();
        command.addListener("execute", this.onExecute, this);

        this.set({ management: management, toolTipText: label });
        this.base(arguments, label, icon, command);

        this.addListener("focusin", this.onFocusAnimate, this);
        this.addListener("pointerover", this.focus, this);

        this._messagingRouteIds = [];

        this.addMessagingListener('enabled-toolbar', this.onSetEnabledToolbar);
    },

    properties: {
        management: {
            check: 'omna.management.AbstractManagement'
        }
    },

    members: {
        _messagingRouteIds: null,

        _applyLabel: function (value, old) {
            var label = this.getChildControl("label", true);

            if (label) label.setValue(this.i18nTrans(value));

            this._handleLabel();
        },

        getRequestManagement: function () {
            this.__requestManagement = this.__requestManagement || this.getManagement().getRequestManagement();

            return this.__requestManagement;
        },

        getI18nCatalog: function () {
            return this.getManagement().getI18nCatalog()
        },

        /**
         * Adds a route handler for the current module channel. The route is called
         * if the {@link #emit} method finds a match.
         *
         * @param msgPatternId {String|RegExp} The pattern, used for checking if the executed path matches.
         * @param handler {Function} The handler to call if the route matches the executed path.
         * @param componentId {Integer?} Id of foraging component that emit message.
         */
        addMessagingListener: function (msgPatternId, handler, componentId) {
            var channel = 'C' + (componentId || this.getManagement().getSettings().id);
            this._messagingRouteIds.push(q.messaging.on(channel, msgPatternId, handler, this));
        },

        onSetEnabledToolbar: function (data) {
          var enabled = data.customData;

          if (qx.lang.Type.isBoolean(this.__previousStatus)) {
              if (enabled){
                  this.setEnabled(this.__previousStatus);
                  this.__previousStatus = null;
              } else {
                  this.setEnabled(false);
              }
          } else {
              this.__previousStatus = this.getEnabled();
              this.setEnabled(enabled && this.__previousStatus);
          }
        },

        /**
         * Sends a message on the current module channel and informs all matching route handlers.
         *
         * @param msgId {String} Messaging identifier.
         * @param customData {Object?} The given custom data that should be propagated.
         * @param params {Object?} The extra params that should be propagated.
         */
        emitMessaging: function (msgId, customData, params) {
            var channel = 'C' + this.getManagement().getSettings().id;
            q.messaging.emit(channel, msgId, params || {}, customData);
        },

        animate: function (animation) {
            if (!(qx.core.Environment.get("css.transform")["name"])) {
                console.warn('No support animation.');
                return;
            }

            qx.bom.element.Animation.animate(this.getContentElement().getDomElement(), animation);
        },

        onFocusAnimate: function (e) {
            this.animate({
                duration: 200,
                keyFrames: {
                    000: { scale: 1.0 },
                    050: { scale: 0.9 },
                    100: { scale: 1.0 }
                }
            });
        }
    },

    destruct: function () {
        if (this.__requestManagement) {
            this.__requestManagement.dispose();
            this.__requestManagement = null;
        }

        this._messagingRouteIds.forEach(function (id) {
            q.messaging.remove(id);
        })
    }
});
