(() => {
    class Canvas {
        constructor(elem) {
            this._canvas = elem;
            this._canvas.width = Math.ceil(.85 * document.documentElement.clientWidth);
            this._canvas.height = Math.ceil(.8 * document.documentElement.clientHeight);

            this._canvasOffsetX = Math.floor(.075 * document.documentElement.clientWidth);
            this._canvasOffsetY = Math.floor(.1 * document.documentElement.clientHeight);

            this._context = this._canvas.getContext('2d');
            this.setOptions();

            this._isPainting = false;
            this._delegateEvents();
        }

        setOptions(options) {
            options = options || {};

            const defaults = {
                'imageSmoothingEnabled': 'true',
                'imageSmoothingQuality': 'high',
                'lineCap': 'round',
                'lineJoin': 'round',
                'lineWidth': '5',
                'strokeStyle': '#000'
            };

            Object.keys(defaults).forEach((key) => {
                this._context[key] = options[key] ? options[key] : defaults[key];
            });
        }

        _delegateEvents() {
            window.addEventListener('mousedown', this._togglePaint.bind(this));

            this._canvas.addEventListener('mouseleave', this._breakStroke.bind(this));

            this._canvas.addEventListener('mousemove', this._onPaint.bind(this));

            // TODO: handle window resizes
            // either, just update the offsets
            // or, implement data layer to store paint pixels, and redraw canvas
        }

        _togglePaint() {
            this._isPainting = !this._isPainting;

            if(this._isPainting) {
                document.body.style.cursor = 'cell';
                this._canvas.style.borderColor = '#000';
            } else {
                document.body.style.cursor = 'crosshair';
                this._canvas.style.borderColor = '#eee';
                this._breakStroke();
            }
        }

        _onPaint(event) {
            if(!this._isPainting) { return; }

            window.requestAnimationFrame(() => {
                this._endStroke(event);
                this._startStroke(event);
            });
        }

        _endStroke(event) {
            this._context.lineTo(
                event.clientX - this._canvasOffsetX,
                event.clientY - this._canvasOffsetY
            );

            this._context.stroke();
        }

        _startStroke(event) {
            this._context.moveTo(
                event.clientX - this._canvasOffsetX,
                event.clientY - this._canvasOffsetY
            );
        }

        _breakStroke() {
            this._context.beginPath();
        }
    }

    let canvas = new Canvas(document.querySelector('#canvas'));
})();
