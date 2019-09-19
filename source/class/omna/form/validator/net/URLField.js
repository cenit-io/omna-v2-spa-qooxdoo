qx.Class.define("omna.form.validator.net.URLField", {
    extend: omna.form.validator.SyncValidator,

    members: {
        // overridden
        onValidate: function (item, value, context) {
            var pattern = /^(https?:\/\/)(\w[\w-]+)(\.\w[\w-]+)+(\.[a-z]{2,3})(\?.*)?$/;

            if (value) {
                if (!pattern.test(value)) {
                    return this.setValid(false, this.tr('The value of this field is not valid'));
                } else {
                    return this.setValid(true);
                }
            } else if (item.isRequired()) {
                return this.setValid(false, this.tr('This field is required'));
            }
        }
    }
});