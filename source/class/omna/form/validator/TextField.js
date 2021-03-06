qx.Class.define("omna.form.validator.TextField", {
  extend: omna.form.validator.SyncValidator,

  members: {
    // overridden
    onValidate: function (item, value, context) {
      let pattern = new RegExp(item.getPattern()),
        minLen = item.getMinLength();

      if (value) {
        if (!pattern.test(value)) {
          return this.setValid(false, this.tr('The value of this field is not valid'));
        } else if (value.length < minLen) {
          return this.setValid(false, this.tr('The value of this field required length more %1', minLen));
        } else {
          return this.setValid(true);
        }
      } else if (item.isRequired()) {
        return this.setValid(false, this.tr('This field is required'));
      }
    }
  }
});