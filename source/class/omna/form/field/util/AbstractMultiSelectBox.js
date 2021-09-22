/**
 * A form widget which allows a multi selection. Looks somewhat like
 * a normal button, but opens a list of items to select when tapping on it.
 *
 * @childControl spacer {qx.ui.core.Spacer} flexible spacer widget
 * @childControl atom {qx.ui.basic.Atom} shows the text and icon of the content
 * @childControl arrow {qx.ui.basic.Image} shows the arrow to open the popup
 */
qx.Class.define("omna.form.field.util.AbstractMultiSelectBox",
  {
    extend: qx.ui.form.AbstractSelectBox,
    implement: [
      qx.ui.core.IMultiSelection,
      qx.ui.form.IForm,
      qx.ui.form.IField,
      qx.ui.form.IModelSelection
    ],
    include: [
      qx.ui.form.MForm,
      omna.form.field.util.MSetProperties,
      omna.form.field.util.MReadOnly,
    ],


    /*
    *****************************************************************************
       CONSTRUCTOR
    *****************************************************************************
    */


    construct: function () {
      this.base(arguments);

      this._createChildControl("atom");
      this._createChildControl("spacer");
      this._createChildControl("arrow");

      // Register listener
      this.addListener("pointerover", this._onPointerOver, this);
      this.addListener("pointerout", this._onPointerOut, this);
      this.addListener("tap", this.toggle, this);

      this.addListener("keyinput", this._onKeyInput, this);
      // this.addListener("changeSelection", this.__onChangeSelection, this);

      window.xxx = this
    },


    /*
    *****************************************************************************
       PROPERTIES
    *****************************************************************************
    */


    properties: {
      // overridden
      appearance: {
        refine: true,
        init: "selectbox"
      },

      rich: {
        init: false,
        check: "Boolean",
        apply: "_applyRich"
      }
    },

    events: {
      /** Fires after the value was modified */
      "changeValue": "qx.event.type.Data",

      /** Fires after the selection was modified */
      "changeSelection": "qx.event.type.Data"
    },

    /*
    *****************************************************************************
       MEMBERS
    *****************************************************************************
    */


    members: {
      /** @type {qx.ui.form.ListItem} instance */
      __preSelectedItems: null,

      open: function () {
        if (!this.isReadOnly()) this.base(arguments);
      },

      _applyRich: function (value, oldValue) {
        this.getChildControl("atom").setRich(value);
      },

      // overridden
      _defaultFormat: function (listItems) {
        if (listItems.length === 0) return;

        if (typeof listItems[0].isRich == "function" && listItems[0].isRich()) this.setRich(true);

        let label = listItems[0].getLabel();
        if (listItems.length > 1) label += ` & (${listItems.length - 1}+)`

        return label;
      },

      // overridden
      _createChildControlImpl: function (id, hash) {
        let control;

        switch (id) {
          case "spacer":
            control = new qx.ui.core.Spacer();
            this._add(control, { flex: 1 });
            break;

          case "atom":
            control = new qx.ui.basic.Atom(" ");
            control.setCenter(false);
            control.setAnonymous(true);

            this._add(control, { flex: 1 });
            break;

          case "arrow":
            control = new qx.ui.basic.Image();
            control.setAnonymous(true);

            this._add(control);
            break;

          case "list":
            control = this.base(arguments, id).set({ selectionMode: "additive" });
            break;
        }

        return control || this.base(arguments, id);
      },

      // overridden
      /**
       * @lint ignoreReferenceField(_forwardStates)
       */
      _forwardStates: {
        focused: true
      },


      /*
      ---------------------------------------------------------------------------
        HELPER METHODS FOR SELECTION API
      ---------------------------------------------------------------------------
      */


      /**
       * Returns the list items for the selection.
       *
       * @return {qx.ui.form.ListItem[]} List items to select.
       */
      _getItems: function () {
        return this.getChildControl("list").getChildren();
      },

      /**
       * Returns if the selection could be empty or not.
       *
       * @return {Boolean} <code>true</code> If selection could be empty,
       *    <code>false</code> otherwise.
       */
      _isAllowEmptySelection: function () {
        return this.getChildrenContainer().getSelectionMode() !== "one";
      },

      /**
       * Event handler for <code>changeSelection</code>.
       *
       * @param e {qx.event.type.Data} Data event.
       */
      __onChangeSelection: function (e) {
        let listItems = e.getData();
        let list = this.getChildControl("list");

        if (listItems.length > 0) {
          list.setSelection(listItems);
        } else {
          list.resetSelection();
        }

        this.__updateLabel();
      },

      /**
       * Sets the label inside the list to match the selected ListItems.
       */
      __updateLabel: function () {
        let listItems = this.getChildControl("list").getSelection();
        let atom = this.getChildControl("atom");
        let format = this.getFormat();
        let label = "";

        if (listItems.length > 0) {
          label = format === null ? this._defaultFormat(listItems) : format.call(this, listItems);
        }

        // check for translation
        if (label && label.translate) label = label.translate();

        label == null ? atom.resetLabel() : atom.setLabel(label);
      },


      /*
      ---------------------------------------------------------------------------
        EVENT LISTENERS
      ---------------------------------------------------------------------------
      */


      /**
       * Listener method for "pointerover" event
       * <ul>
       * <li>Adds state "hovered"</li>
       * <li>Removes "abandoned" and adds "pressed" state (if "abandoned" state is set)</li>
       * </ul>
       *
       * @param e {qx.event.type.Pointer} Pointer event
       */
      _onPointerOver: function (e) {
        if (!this.isEnabled() || e.getTarget() !== this) return;

        if (this.hasState("abandoned")) {
          this.removeState("abandoned");
          this.addState("pressed");
        }

        this.addState("hovered");
      },


      /**
       * Listener method for "pointerout" event
       * <ul>
       * <li>Removes "hovered" state</li>
       * <li>Adds "abandoned" and removes "pressed" state (if "pressed" state is set)</li>
       * </ul>
       *
       * @param e {qx.event.type.Pointer} Pointer event
       */
      _onPointerOut: function (e) {
        if (!this.isEnabled() || e.getTarget() !== this) return;

        this.removeState("hovered");

        if (this.hasState("pressed")) {
          this.removeState("pressed");
          this.addState("abandoned");
        }
      },

      /**
       * Toggles the popup's visibility.
       *
       * @param e {qx.event.type.Pointer} Pointer event
       */
      _onTap: function (e) {
        this.toggle();
      },

      // overridden
      _onKeyPress: function (e) {
        if (this.isReadOnly()) return;

        let iden = e.getKeyIdentifier();
        if (iden == "Enter" || iden == "Space") {
          // Apply pre-selected item (translate quick selection to real selection)
          if (this.__preSelectedItems) {
            this.setSelection(this.__preSelectedItems);
            this.__preSelectedItems = null;
          }

          this.toggle();
        } else {
          this.base(arguments, e);
        }
      },

      /**
       * Forwards key event to list widget.
       *
       * @param e {qx.event.type.KeyInput} Key event
       */
      _onKeyInput: function (e) {
        // clone the event and re-calibrate the event
        let clone = e.clone();

        clone.setTarget(this._list);
        clone.setBubbles(false);

        // forward it to the list
        this.getChildControl("list").dispatchEvent(clone);
      },


      // overridden
      _onListPointerDown: function (e) {
        // Apply pre-selected item (translate quick selection to real selection)
        if (this.__preSelectedItems) {
          this.setSelection(this.__preSelectedItems);
          this.__preSelectedItems = null;
        }
      },

      _onListChangeSelection: function (e) {
        this.__updateLabel();
      },

      getList: function (items) {
        return this.getChildControl("list");
      },

      setSelection: function (items) {
        this.getList().setSelection(items);
      },

      getSelection: function () {
        return this.getList().getSelection();
      },

      resetSelection: function () {
        this.getList().resetSelection();
      },

      isSelected: function (item) {
        return this.getList().isSelected(item);
      },

      isSelectionEmpty: function () {
        return this.getList().isSelectionEmpty();
      },

      getSelectables: function (all) {
        return this.getList().getSelectables(all);
      },

      clearSelection: function () {
        this.getList().clearSelection();
      },

      setValue: function (items) {
        this.getList().setValue(items);
      },

      getValue: function () {
        return this.getList().getValue();
      },

      resetValue: function () {
        this.getList().resetValue();
      },

      getModelSelection: function () {
        return this.getList().getModelSelection();
      },

      setModelSelection: function (value) {
        this.getList().setModelSelection(value);
      },

      selectAll: function () {
        return this.getList().selectAll();
      },

      addToSelection: function (item) {
        this.getList().addToSelection(item);
      },

      removeFromSelection: function (item) {
        return this.getList().removeFromSelection(item);
      }
    },

    /*
    *****************************************************************************
       DESTRUCT
    *****************************************************************************
    */

    destruct: function () {
      this.__preSelectedItems = null;
    }
  });
