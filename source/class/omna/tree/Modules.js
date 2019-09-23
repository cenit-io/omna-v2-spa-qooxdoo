/**
 * @asset(qx/icon/${qx.icontheme}/16/mimetypes/text-plain.png)
 * @asset(qx/icon/${qx.icontheme}/16/places/folder-open.png)
 * @asset(qx/icon/${qx.icontheme}/16/places/folder.png)
 */
qx.Class.define("omna.tree.Modules", {
    type: 'singleton',
    extend: qx.ui.treevirtual.TreeVirtual,
    include: [omna.mixin.MSettings],

    /**
     * Constructor
     */
    construct: function () {
        this.base(arguments, [this.tr("Modules")]);
        this.setRowHeight(22);

        this.loadModules();

        // Not move the focus with the mouse.
        this.setFocusCellOnPointerMove(false);

        // Add Listener events.
        this.addListener('keyup', this.onKeyup, this);
        this.addListener("click", this.onClick, this);
    },

    members: {
        /**
         * Add nodes to tree from given nodes.
         *
         * @param root {Integer?null}
         * @param nodes {Array}
         * @internal
         */
        __addNodes: function (root, nodes) {
            var dataModel = this.getDataModel(),
                node;

            nodes.forEach(function (module) {
                if (module.disabled) return;

                var i18nCatalog = module.id || module.id,
                    label = omna.I18n.trans(i18nCatalog, 'Labels', 'MODULE-REFERENCE');

                if (module.children) {
                    node = dataModel.addBranch(root, label, true);
                    this.__addNodes(node, module.children);
                } else {
                    node = dataModel.addLeaf(root, label)
                }
                dataModel.setColumnData(node, 0, module);
            }, this);
        },

        loadModules: function () {
            this.loadSettings('omna/settings/Modules', function (nodes) {
                // Add nodes to tree data model.
                this.__addNodes(null, nodes);
                this.getDataModel().setData();
            });
        },

        /**
         * Connect the text field with the tree filter.
         *
         * @param filterField {omna.form.field.util.SearchTextField}
         */
        setFilter: function (filterField) {
            filterField.addListener("changeValue", this.onFilterChangeValue, this);

            this.getDataModel().setFilter(function (node) {
                if (node.type == qx.ui.treevirtual.MTreePrimitive.Type.LEAF) {
                    var label = node.label.toUpperCase(),
                        filter = (filterField.getValue() || '').toUpperCase();

                    return label.indexOf(filter) != -1;
                }
                return true;
            });
        },

        /**
         * Fired after data was loaded.
         *
         * @param e {qx.event.type.Data}
         */
        onStoreLoaded: function (e) {
            var nodes = qx.util.Serializer.toNativeObject(e.getData());

            this.__addNodes(null, nodes);
            this.getDataModel().setData();
        },

        /**
         * This event if fired if a keyboard key is released.
         *
         * @param e {qx.event.type.KeySequence} Keypress event.
         */
        onKeyup: function (e) {
            var keyCode = e.getKeyCode(),
                nodes = this.getSelectedNodes();

            if (nodes.length == 1 && (keyCode == 13 || keyCode == 32)) {
                q.messaging.emit("Application", "open-module", nodes[0].columnData[0]);
            }
        },

        /**
         * Widget is clicked using left or middle button.
         *
         * @param e {qx.event.type.Mouse}
         */
        onClick: function (e) {
            var node = this.getSelectedNodes()[0];

            if (node) q.messaging.emit("Application", "open-module", node.columnData[0]);
        },

        /**
         * Fired when the filter field change.
         *
         * @param e {qx.event.type.Data}
         */
        onFilterChangeValue: function (e) {
            this.getDataModel().setData();
        }
    }
});
