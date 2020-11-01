qx.Class.define("omna.form.dialog.Search", {
  extend: omna.form.dialog.AbstractForm,
  include: [omna.mixin.MWithManagement],

  /**
   * Constructor
   *
   * @param management {omna.management.AbstractManagement}
   * @param caption {String} The caption text.
   * @param icon {String} The URL of the caption bar icon.
   */
  construct: function (management, caption, icon) {
    let settings = management.getSettings();

    this.set({ management: management, width: settings.searchFormWidth || settings.formWidth });

    this.base(arguments, caption, icon);
  },

  members: {
    _createRenderer: function () {
      let renderer = new omna.form.renderer.SingleWithCheck(this._form);
      renderer.getLayout().setColumnFlex(1, 0);
      renderer.getLayout().setColumnFlex(2, 1);
      this.add(renderer);
    },

    _createFormFields: function (form) {
      let management = this.getManagement(),
        fields = management.getFields();

      fields.forEach(function (field) {
        if (field.includeInSearch && field.widgetClass) {
          let widgetClass = qx.Class.getByName(field.widgetClass);

          if (widgetClass) {
            let widget = new widgetClass();
            widget.setSettings ? widget.setSettings(field) : widget.__settings = field;
            widget.setWidth && widget.setWidth(Math.floor(this.getWidth() * 67 / 100));
            widget.setFromJSON(field);

            if (qx.Class.hasProperty(widget.constructor, 'required')) widget.setRequired(false);

            if (field.validatorClass) {
              let validator,
                validatorClass = qx.Class.getByName(field.validatorClass);

              if (validatorClass) {
                validator = new validatorClass();
              } else {
                q.messaging.emit("Application", "error", this.tr("Class no found: '%1'.", field.validatorClass));
              }
            } else {
              validator = widgetClass.validatorClass ? new widgetClass.validatorClass : null;
            }

            let label = this.i18nTrans(field.label || field.name);
            form.add(widget, label, validator, field.customModelName || field.name, form);

          } else {
            q.messaging.emit("Application", "error", this.tr("Class no found: '%1'.", field.widgetClass));
          }
        }
      }, this);

      this.initializeItems();
    }
  }
});