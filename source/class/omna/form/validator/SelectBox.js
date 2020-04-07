qx.Class.define("omna.form.validator.SelectBox", {
    extend: omna.form.validator.SyncValidator,

    members: {
        // overridden
        onValidate: function (item, value, context) {
            if (item.isRequired() && (!value || value.getModel() === null)) {
                return this.setValid(false, this.tr('This field is required'));
            }
        }
    }
});