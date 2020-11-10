"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var taro_1 = require("@tarojs/taro");
var components_1 = require("@tarojs/components");
var prop_types_1 = require("prop-types");
var renderer_1 = require("./lib/renderer");
require("./f2-canvas.css");
function randomStr(long) {
    var chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
    var maxPos = chars.length;
    var string = '';
    for (var i = 0; i < long; i++) {
        string += chars.charAt(Math.floor(Math.random() * maxPos));
    }
    return string;
}
var F2Canvas = /** @class */ (function (_super) {
    __extends(F2Canvas, _super);
    function F2Canvas() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.state = {
            width: '100%',
            height: '100%;',
        };
        _this.id = 'f2-canvas-' + randomStr(16);
        return _this;
    }
    F2Canvas.prototype.componentWillMount = function () {
        var _this = this;
        if (process.env.TARO_ENV !== 'h5') {
            setTimeout(function () {
                var query = taro_1.default.createSelectorQuery().in(_this.$scope);
                query.select('#' + _this.id).boundingClientRect().exec(function (res) {
                    var ctx = taro_1.default.createCanvasContext(process.env.TARO_ENV === 'weapp' ? 'f2-canvas' : _this.id, _this.$scope);
                    var canvasWidth = res[0].width;
                    var canvasHeight = res[0].height;
                    var canvas = new renderer_1.default(ctx, process.env.TARO_ENV);
                    _this.canvas = canvas;
                    _this.props.onCanvasInit(canvas, canvasWidth, canvasHeight);
                });
            }, 1);
        }
    };
    F2Canvas.prototype.componentDidMount = function () {
    };
    F2Canvas.prototype.componentWillUnmount = function () {
    };
    F2Canvas.prototype.componentDidShow = function () {
    };
    F2Canvas.prototype.componentDidHide = function () {
    };
    F2Canvas.prototype.touchStart = function (e) {
        if (this.canvas) {
            this.canvas.emitEvent('touchstart', [e]);
        }
    };
    F2Canvas.prototype.touchMove = function (e) {
        if (this.canvas) {
            this.canvas.emitEvent('touchmove', [e]);
        }
    };
    F2Canvas.prototype.touchEnd = function (e) {
        if (this.canvas) {
            this.canvas.emitEvent('touchend', [e]);
        }
    };
    F2Canvas.prototype.press = function (e) {
        if (this.canvas) {
            this.canvas.emitEvent('press', [e]);
        }
    };
    F2Canvas.prototype.htmlCanvas = function (canvas) {
        var _this = this;
        if (!canvas)
            return;
        setTimeout(function () {
            _this.canvas = canvas;
            _this.props.onCanvasInit(canvas, canvas.offsetWidth, canvas.offsetHeight);
        }, 1);
    };
    F2Canvas.prototype.render = function () {
        var id = this.id;
        if (process.env.TARO_ENV === 'h5') {
            return <canvas ref={this.htmlCanvas.bind(this)} className={'f2-canvas ' + id}></canvas>;
        }
        if (process.env.TARO_ENV !== 'h5') {
            return <components_1.Canvas style={'width: ' + this.state.width + '; height:' + this.state.height} className='f2-canvas' canvasId='f2-canvas' id={id} onTouchStart={this.touchStart.bind(this)} onTouchMove={this.touchMove.bind(this)} onTouchEnd={this.touchEnd.bind(this)} onLongPress={this.press.bind(this)}/>;
        }
    };
    F2Canvas.defaultProps = {
        onCanvasInit: function () {
        },
    };
    F2Canvas.propTypes = {
        onCanvasInit: prop_types_1.default.any,
    };
    return F2Canvas;
}(taro_1.Component));
exports.default = F2Canvas;
function strLen(str) {
    var len = 0;
    for (var i = 0; i < str.length; i++) {
        if (str.charCodeAt(i) > 0 && str.charCodeAt(i) < 128) {
            len++;
        }
        else {
            len += 2;
        }
    }
    return len;
}
F2Canvas.fixF2 = function (F2) {
    if ((!F2) || F2.TaroFixed) {
        return F2;
    }
    if (process.env.TARO_ENV !== 'h5') {
        F2.Util.measureText = function (text, font, ctx) {
            if (!ctx) {
                var fontSize = 12;
                if (font) {
                    fontSize = parseInt(font.split(' ')[3], 10);
                }
                fontSize /= 2;
                return {
                    width: strLen(text) * fontSize
                };
            }
            ctx.font = font || '12px sans-serif';
            return ctx.measureText(text);
        };
        F2.Util.addEventListener = function (source, type, listener) {
            source.addListener(type, listener);
        };
        F2.Util.getStyle = function (el, property) {
            return el.currentStyle ? el.currentStyle[property] : undefined;
        };
        F2.Util.removeEventListener = function (source, type, listener) {
            source.removeListener(type, listener);
        };
        F2.Util.createEvent = function (event, chart) {
            var type = event.type;
            var x = 0;
            var y = 0;
            var touches = event.touches;
            if (touches && touches.length > 0) {
                x = touches[0].x;
                y = touches[0].y;
            }
            return {
                type: type,
                chart: chart,
                x: x,
                y: y
            };
        };
        if (taro_1.default && taro_1.default.getSystemInfoSync) {
            var systeamInfo = taro_1.default.getSystemInfoSync();
            if (systeamInfo && systeamInfo.pixelRatio) {
                F2.Global.pixelRatio = systeamInfo.pixelRatio;
            }
        }
    }
    else {
        F2.Global.pixelRatio = window.devicePixelRatio;
    }
    F2.TaroFixed = true;
    return F2;
};
