qx.Class.define("omna.action.AbstractActionWithSelectedItem", {
    type: 'abstract',
    extend: omna.action.AbstractAction,

    construct: function (management, label, icon) {
        this.base(arguments, management, label, icon);
        this.set({ enabled: false, baseParams: {} });
        this.addMessagingListener('selection-change', this.onSelectionChange);
    },

    properties: {
        selectedItem: {
            nullable: true
        },

        selectedIndex: {
            nullable: true
        },

        enablingRules: {
            check: 'String',
            nullable: true
        },

        baseParams: {
            check: 'Object'
        }
    },

    members: {
        _checkEnablingRules: function (selectedItem) {
            let enablingRules = this.getEnablingRules() || 'true';

            return function (enablingRules) {
                with (this) return eval(enablingRules);
            }.call(selectedItem, enablingRules)
        },

        onSelectionChange: function (data) {
            let customData = data.customData || {},
                selectedItem = customData.item || null,
                selectedIndex = customData.index === undefined ? null : customData.index,
                enabled = qx.lang.Type.isObject(selectedItem) && this._checkEnablingRules(selectedItem);

            this.set({
                enabled: enabled,
                selectedItem: selectedItem,
                selectedIndex: selectedIndex,
                baseParams: data.params || {}
            })
        }
    }
});
