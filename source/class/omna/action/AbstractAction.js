qx.Class.define("omna.action.AbstractAction", {
  type: 'abstract',
  extend: qx.ui.form.Button,
  include: [omna.mixin.MI18n, omna.mixin.MWithManagement],
  implement: [omna.mixin.II18n],

  construct: function (management, label, icon) {
    // Create and configure the command
    let command = new qx.ui.command.Command();
    command.addListener("execute", this.onExecute, this);

    this.set({ management: management, toolTipText: label });
    this.base(arguments, label, icon, command);

    this.addListener("focusin", this.onFocusAnimate, this);
    this.addListener("pointerover", this.focus, this);

    this._messagingRouteIds = [];

    this.addMessagingListener('enabled-toolbar', this.onSetEnabledToolbar);
  },

  members: {
    _messagingRouteIds: null,

    _applyLabel: function (value, old) {
      let label = this.getChildControl("label", true);

      if (label) label.setValue(this.i18nTrans(value));

      this._handleLabel();
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
      let channel = 'C' + (componentId || this.getManagement().getSettings().id);
      this._messagingRouteIds.push(q.messaging.on(channel, msgPatternId, handler, this));
    },

    onSetEnabledToolbar: function (data) {
      if (data.customData) {
        if (qx.lang.Type.isBoolean(this.__previousStatus)) this.setEnabled(this.__previousStatus);
        this.__previousStatus = null;
      } else {
        this.__previousStatus = this.getEnabled();
        this.setEnabled(false);
      }
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
    this._messagingRouteIds.forEach(function (id) {
      q.messaging.remove(id);
    })
  }
});
