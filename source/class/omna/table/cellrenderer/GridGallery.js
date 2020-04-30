qx.Class.define("omna.table.cellrenderer.GridGallery", {
    extend: qx.ui.table.cellrenderer.Conditional,

    construct: function (settings) {
        settings.gridRendererStyle = settings.gridRendererStyle || {};

        this.base(arguments, 'center');
    },

    properties: {
        maximumFractionDigits: {
            check: 'Number',
            apply: '_applyMaximumFraction'
        }
    },

    members: {
        // overridden
        _getContentHtml: function (cellInfo) {
            let images = cellInfo.value || [];

            if (images.length != 0) {
                let idx = Math.round(Math.random() * images.length),
                    style = qx.bom.Template.render(
                        'max-width:{{w}}px;max-height:{{h}}px;', {
                            w: cellInfo.styleWidth - this._insetX, h: cellInfo.styleHeight - this._insetY
                        }
                    );

                return qx.bom.Template.render('<image class="gallery" src="{{src}}" style="{{style}}"/>', {
                    src: images[idx], style: style
                });
            }

            return '...'
        }
    }
});
