/**
 * @childControl toolbar {qx.ui.toolbar.ToolBar} Toolbar
 *
 */
qx.Class.define("omna.management.AbstractManagement", {
    type: 'abstract',
    extend: qx.ui.container.Composite,
    include: [omna.mixin.MI18n],
    implement: [omna.mixin.II18n],

    statics: {
        propertiesDefaultValues: {
            i18n: 'Common',
            edge: 'center',
            region: 100,
            listenFromComponentId: null
        }
    },

    /**
     * Constructor
     *
     * @param settings {Object} Component settings.
     * @param customData {Object} Extra custom data. Ex { params: {...} }
     * @param modulePage {omna.management.Page} Current page where render this component.
     */
    construct: function (settings, customData, modulePage) {
        this.base(arguments);

        this.set({
            layout: new qx.ui.layout.VBox(5),
            decorator: "omna-management",
            settings: settings,
            customData: customData,
            modulePage: modulePage
        });

        this.__messagingRouteIds = [];
        this.__menuItemStore = {};

        this._createChildControlImpl('toolbar');

        this.addListener("changeCustomData", this.onChangeCustomData);

        if (customData) setTimeout((customData) => {
            this.fireEvent('changeCustomData', qx.event.type.Data, [customData]);
        }, 5, customData);
    },

    events: {
        changeCustomData: 'qx.event.type.Data'
    },

    properties: {
        settings: {
            check: 'Object',
            transform: '_setDefaultPropertiesValues'
        },

        customData: {
            check: 'Object',
            event: 'changeCustomData'
        },

        modulePage: {
            check: 'omna.management.Page'
        }
    },

    members: {
        __messagingRouteIds: null,
        __overflowMenu: null,
        __menuItemStore: null,

        getRequestBaseParams: function () {
            let settings = this.getSettings(),
                customData = this.getCustomData(),
                localFieldName = settings.localFieldName,
                baseParams = {};

            if (localFieldName && baseParams[localFieldName] === undefined) baseParams[localFieldName] = -1;

            qx.lang.Object.mergeWith(baseParams, settings.baseParams);
            qx.lang.Object.mergeWith(baseParams, customData.params);

            return baseParams;
        },

        getRequestManagement: function () {
            if (!this.__requestManagement) {
                let settings = this.getSettings();

                if (settings.requestManagementClass) {
                    let RequestManagementClass = settings.requestManagementClass;

                    if (qx.lang.Type.isString(RequestManagementClass)) {
                        RequestManagementClass = this._getClassByName(RequestManagementClass);
                    }

                    this.__requestManagement = RequestManagementClass ? new RequestManagementClass() : null
                } else if (settings.serviceBasePath) {
                    this.__requestManagement = new omna.request.Customs(settings.serviceBasePath);
                }
            }

            this.__requestManagement.setBaseParams(this.getRequestBaseParams());

            return this.__requestManagement
        },

        // overridden
        _createChildControlImpl: function (id, hash) {
            let control;

            switch ( id ) {
                case "toolbar":
                    let actions = this.getActions();

                    if (actions.length) {
                        control = this._createToolbar(actions);
                        this._add(control, { flex: 1 });
                    }

                    break;
            }

            return control || this.base(arguments, id);
        },

        _setDefaultPropertiesValues: function (settings) {
            let propertiesSettings = this.constructor.propertiesDefaultValues;

            Object.keys(propertiesSettings).forEach(function (propertyName) {
                if (settings[propertyName] === undefined) {
                    settings[propertyName] = propertiesSettings[propertyName]
                }
            });

            return settings;
        },

        _getClassByName: function (className, notify) {
            notify = notify !== undefined ? notify : true;

            let klass = qx.Class.getByName(className);

            if (!klass && notify) this.error("CLASS_NO_FOUND", [className]);

            return klass
        },

        _createToolbar: function (actions) {
            let toolbar = new qx.ui.toolbar.ToolBar();

            toolbar.setSpacing(5);
            toolbar.setMinHeight(35);
            toolbar.setMaxHeight(35);
            toolbar.setOverflowHandling(true);
            toolbar.addSeparator();

            actions.forEach(function (action) {
                if (!(action instanceof qx.ui.core.Widget)) {
                    let enablingRules;

                    if (!qx.lang.Type.isString(action)) {
                        enablingRules = action.enablingRules;
                        action = action.widgetClass
                    }

                    let widgetClass = this._getClassByName(action);

                    if (widgetClass) {
                        action = new widgetClass(this);
                        enablingRules && action.setEnablingRules && action.setEnablingRules(enablingRules);
                    } else {
                        q.messaging.emit("Application", "error", this.tr("Class no found: '%1'.", action));
                        return;
                    }
                }

                toolbar.add(action);
            }, this);

            // Add overflow indicator.
            let chevron = new qx.ui.form.MenuButton(null, "icon/16/actions/media-seek-forward.png"),
                overflowMenu = this.__overflowMenu = new qx.ui.menu.Menu();

            chevron.setAppearance("button");
            chevron.setMenu(overflowMenu);
            chevron.setAlignX('right');
            toolbar.add(chevron);
            toolbar.setOverflowIndicator(chevron);

            // add the listener
            toolbar.addListener("hideItem", this._onHideItem, this);
            toolbar.addListener("showItem", this._onShowItem, this);

            return toolbar;
        },

        /**
         * Handler for the overflow handling which will be called on hide.
         * @param e {qx.event.type.Data} The event.
         */
        _onHideItem: function (e) {
            let partItem = e.getData();
            let menuItems = this._getMenuItems(partItem);
            for (let i = 0, l = menuItems.length; i < l; i++) {
                menuItems[i].setVisibility("visible");
            }
        },

        /**
         * Handler for the overflow handling which will be called on show.
         * @param e {qx.event.type.Data} The event.
         */
        _onShowItem: function (e) {
            let partItem = e.getData();
            let menuItems = this._getMenuItems(partItem);
            for (let i = 0, l = menuItems.length; i < l; i++) {
                menuItems[i].setVisibility("excluded");
            }
        },

        getActions: function () {
            return this.getSettings().actions || [];
        },

        /**
         * Helper for the overflow handling. It is responsible for returning a
         * corresponding menu item for the given toolbar item.
         *
         * @param toolbarItem {qx.ui.core.Widget} The toolbar item to look for.
         * @return {qx.ui.core.Widget} The coresponding menu items.
         */
        _getMenuItems: function (partItem) {
            let cachedItems = [],
                cachedItem = this.__menuItemStore[partItem.toHashCode()];

            if (!cachedItem) {
                if (partItem instanceof qx.ui.toolbar.MenuButton) {
                    cachedItem = new qx.ui.menu.Button(
                        partItem.getLabel(),
                        partItem.getIcon(),
                        partItem.getCommand(),
                        partItem.getMenu()
                    );
                    cachedItem.setToolTipText(partItem.getToolTipText());
                    cachedItem.setEnabled(partItem.getEnabled());
                    partItem.bind("enabled", cachedItem, "enabled");
                } else if (partItem instanceof qx.ui.toolbar.Button) {
                    cachedItem = new qx.ui.menu.Button(
                        partItem.getLabel(),
                        partItem.getIcon()
                    );
                    cachedItem.getChildControl('label', false).setRich(true);
                    cachedItem.setTextColor(partItem.getTextColor());
                    cachedItem.setToolTipText(partItem.getToolTipText());
                    cachedItem.setEnabled(partItem.getEnabled());
                    partItem.bind("enabled", cachedItem, "enabled");
                    let listeners = qx.event.Registration.getManager(partItem).getListeners(partItem, 'execute');
                    if (listeners && listeners.length > 0) {
                        for (let j = 0, k = listeners.length; j < k; j++) {
                            cachedItem.addListener('execute', qx.lang.Function.bind(listeners[j].handler, listeners[j].context));
                        }
                    }
                } else if (partItem instanceof qx.ui.toolbar.CheckBox) {
                    cachedItem = new qx.ui.menu.CheckBox(
                        partItem.getLabel()
                    );
                    cachedItem.setToolTipText(partItem.getToolTipText());
                    cachedItem.setEnabled(partItem.getEnabled());
                    partItem.bind("enabled", cachedItem, "enabled");
                } else if (partItem instanceof qx.ui.form.Button) {
                    cachedItem = new qx.ui.menu.Button(
                        partItem.getLabel(),
                        partItem.getIcon(),
                        partItem.getCommand()
                    );
                    cachedItem.setToolTipText(partItem.getToolTipText());
                    cachedItem.setEnabled(partItem.getEnabled());
                    partItem.bind("enabled", cachedItem, "enabled");
                } else {
                    cachedItem = new qx.ui.menu.Separator();
                }

                this.__menuItemStore[partItem.toHashCode()] = cachedItem;
                this.__overflowMenu.add(cachedItem)
            }

            cachedItems.push(cachedItem);

            return cachedItems;
        },

        getI18nCatalog: function () {
            let settings = this.getSettings();

            return settings.i18n || settings.id;
        },

        /**
         * Adds a route handler for the current module channel. The route is called
         * if the {@link #emit} method finds a match.
         *
         * @param msgPatternId {String|RegExp} The pattern, used for checking if the executed path matches.
         * @param handler {Function} The handler to call if the route matches the executed path.
         * @param componentId {Integer?} Id of foraging component that emit message.
         */
        addMessagingListener: function (msgPatternId, handler, componentId) {
            let channel = 'C' + (componentId || this.getSettings().id);
            this.__messagingRouteIds.push(q.messaging.on(channel, msgPatternId, handler, this));
        },

        /**
         * Sends a message on the current module channel and informs all matching route handlers.
         *
         * @param msgId {String} Messaging identifier.
         * @param customData {Map?} The given custom data that should be propagated.
         * @param params {Map?} The given parameters that should be propagated
         * @param managementId {String} Management id.
         */
        emitMessaging: function (msgId, customData, params, managementId) {
            if (qx.lang.Type.isString(params)) {
                managementId = params;
                params = null
            }

            let channel = 'C' + (managementId || this.getSettings().id);

            q.messaging.emit(channel, msgId, params, customData);
        },

        onChangeCustomData: function (e) {
            //  TODO: Virtual method.
        }
    },

    destruct: function () {
        if (this.__requestManagement) {
            this.__requestManagement.dispose();
            this.__requestManagement = null;
        }

        this.__messagingRouteIds.forEach(function (id) {
            q.messaging.remove(id);
        })
    }
});
