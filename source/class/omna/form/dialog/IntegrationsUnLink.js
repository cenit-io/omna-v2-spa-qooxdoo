qx.Class.define("omna.form.dialog.IntegrationsUnLink", {
    extend: omna.form.dialog.IntegrationsAbstractLink,

    members: {
        _createFormFields: function (form) {
            this.base(arguments, form);

            let afterUnLink = new omna.form.field.LocalSelectBox(),
                validator = new omna.form.validator.SelectBox;

            afterUnLink.set({
                width: 480,
                options: [
                    { value: null, label: '-' },
                    { value: false, label: this.i18nTrans('not_remove_from_integration') },
                    { value: true, label: this.i18nTrans('remove_from_integration') },
                ],
                required: true,
            });

            form.add(afterUnLink, this.i18nTrans('after_unlink'), validator, 'after_unlink', form);
        }
    }
});