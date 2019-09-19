qx.Class.define("omna.layout.LeftBox", {
    type: "singleton",
    extend: qx.ui.container.Composite,

    /**
     * Constructor
     */
    construct: function () {
        this.base(arguments);
        this.setWidth(250);
        this.setLayout(new qx.ui.layout.VBox(5));
        this.setAllowGrowY(false);

        var modules = omna.tree.Modules.getInstance(),
            filterField = new omna.form.field.util.SearchTextField().set({
                appearance: 'filter-text-field'
            });

        modules.setFilter(filterField);

        this.add(filterField, { flex: 1 });
        this.add(modules, { flex: 2 });
    },

    members: {}
});
