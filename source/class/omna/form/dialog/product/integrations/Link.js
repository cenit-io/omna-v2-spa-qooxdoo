qx.Class.define("omna.form.dialog.product.integrations.Link", {
    extend: omna.form.dialog.integration.AbstractLink,

    members: {

        _createFormFields: function (form) {
            this.base(arguments, form);

            let applyToItsVariants = new omna.form.field.LocalSelectBox(),
                validator = new omna.form.validator.SelectBox;

            applyToItsVariants.set({
                options: [
                    { value: null, label: '-' },
                    { value: 'NONE', label: this.i18nTrans('not_link_with_its_variants') },
                    { value: 'SELECTED', label: this.i18nTrans('link_selected_with_its_variants') },
                    { value: 'NEW', label: this.i18nTrans('link_new_with_its_variants') },
                    { value: 'ALL', label: this.i18nTrans('link_all_with_its_variants') }
                ],
                required: true,
            });

            form.add(applyToItsVariants, this.i18nTrans('link_with_its_variants'), validator, 'link_with_its_variants', form);
        },

        setData: function (data, redefineResetter) {
            data = {
                id: data.id,
                link_with_its_variants: null,
                integration_ids: data.integrations ? data.integrations.map((integration) => integration.id) : []
            };

            return this.base(arguments, data, redefineResetter);
        }
    }
});