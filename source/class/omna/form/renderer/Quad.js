qx.Class.define("omna.form.renderer.Quad", {
    extend: qx.ui.form.renderer.Single,

    //override
    construct: function (form) {
        this.base(arguments, form);

        var i, layout = this.getLayout();

        for (i = 0; i < this.__maxColumn; i++) layout.setColumnFlex(i, 1);
    },

    members: {
        __currentColumn: 0,
        __maxColumn: 4,

        //override
        addItems: function (items, names, title, itemsOptions, headerOptions) {

            // add the header
            if (title != null) {
                title = this._createHeader(title);
                this._add(title, { row: this._row, column: 0, colSpan: this.__maxColumn });
                this._row++;
            }

            // add the items
            var i, itemsOption, colSpan, label, currentColumn = 0;

            for (i = 0; i < items.length; i++) {
                itemsOption = itemsOptions[i] || {};
                colSpan = itemsOption.colSpan || 1;
                colSpan = Math.max(1, Math.min(colSpan, this.__maxColumn));

                if (currentColumn + colSpan > this.__maxColumn) {
                    currentColumn = 0;
                    this._row += 2;
                }

                label = this._createLabel(names[i] || '', items[i]);
                this._add(label, { row: this._row, column: currentColumn, colSpan: colSpan });
                this._add(items[i], { row: this._row + 1, column: currentColumn, colSpan: colSpan });
                label.setBuddy(items[i]);
                this._connectVisibility(items[i], label);

                currentColumn += colSpan

                // store the names for translation
                if (qx.core.Environment.get("qx.dynlocale")) {
                    this._names.push({ name: names[i], label: label, item: items[i] });
                }
            }
            this._row += 2;
        },

        //override
        addButton: function (button) {
            if (this._buttonRow == null) {
                var hbox = new qx.ui.layout.HBox();

                this._buttonRow = new qx.ui.container.Composite();
                this._buttonRow.setMarginTop(5);

                hbox.setAlignX("right");
                hbox.setSpacing(5);

                this._buttonRow.setLayout(hbox);

                this._add(this._buttonRow, { row: this._row, column: 0, colSpan: this.__maxColumn });

                this._row++;
            }

            this._buttonRow.add(button);
        },

        _createLabel: function (name, item) {
            var label = this.base(arguments, name, item);

            label.setAlignX("left");

            return label;
        },

        _createHeader: function (title) {
            var header = this.base(arguments, title + ':');

            header.set({ allowGrowX: true, decorator: 'from-group-separator' });

            return header;
        }
    },

    destruct: function () {
        //TODO: DESTRUCT
    }
});