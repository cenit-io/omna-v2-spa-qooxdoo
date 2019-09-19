qx.Class.define("omna.action.AbstractActionWithSelectedItem", {
    type: 'abstract',
    extend: omna.action.AbstractAction,

    construct: function (management, label, icon) {
        this.base(arguments, management, label, icon);
        this.setEnabled(false);
        this.addMessagingListener('selection-change', this.onSelectionChange);
    },

    properties: {
        selectedItem: {
            nullable: true
        },

        selectedIndex: {
            nullable: true
        }
    },

    members: {
        onSelectionChange: function (data) {
            var customData = data.customData || {};
            this.set({
                enabled: data.customData !== null,
                selectedItem: customData.item || null,
                selectedIndex: customData.index || null
            })
        }
    }
});
