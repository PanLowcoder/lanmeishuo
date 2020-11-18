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
var wolfy87_eventemitter_1 = require("wolfy87-eventemitter");
var CAPITALIZED_ATTRS_MAP_WX = {
    fontSize: 'FontSize',
    opacity: 'GlobalAlpha',
    lineDash: 'LineDash',
    textAlign: 'TextAlign',
};
/**
 * wxapp textAlign align 可选值为 left|center|right
 * 标准canvas textAlign align 可选值为 left|center|right|start|end
 */
var TEXT_ALIGN_MAP = {
    'start': 'left',
    'end': 'right',
};
var CAPITALIZED_ATTRS_MAP_ALI = {
    fillStyle: 'FillStyle',
    fontSize: 'FontSize',
    globalAlpha: 'GlobalAlpha',
    opacity: 'GlobalAlpha',
    lineCap: 'LineCap',
    lineJoin: 'LineJoin',
    lineWidth: 'LineWidth',
    miterLimit: 'MiterLimit',
    strokeStyle: 'StrokeStyle',
    textAlign: 'TextAlign',
    textBaseline: 'TextBaseline'
};
var Renderer = /** @class */ (function (_super) {
    __extends(Renderer, _super);
    function Renderer(wxCtx, type) {
        if (type === void 0) { type = 'weapp'; }
        var _this = _super.call(this) || this;
        _this.style = {}; // just mock
        _this.TARO_ENV = '';
        _this.ctx = wxCtx;
        _this.CAPITALIZED_ATTRS_MAP = { weapp: CAPITALIZED_ATTRS_MAP_WX, alipay: CAPITALIZED_ATTRS_MAP_ALI }[type];
        _this.TARO_ENV = type;
        _this._initContext(wxCtx);
        return _this;
    }
    Renderer.prototype.getContext = function (type) {
        if (type === '2d') {
            return this.ctx;
        }
    };
    Renderer.prototype._initContext = function (wxCtx) {
        var _this = this;
        Object.keys(this.CAPITALIZED_ATTRS_MAP).map(function (style) {
            Object.defineProperty(wxCtx, style, {
                set: function (value) {
                    if (_this.TARO_ENV == 'weapp') {
                        if (style == "textAlign") {
                            value = TEXT_ALIGN_MAP[value] ? TEXT_ALIGN_MAP[value] : value;
                        }
                    }
                    var name = 'set' + _this.CAPITALIZED_ATTRS_MAP[style];
                    wxCtx[name](value);
                }
            });
        });
    };
    return Renderer;
}(wolfy87_eventemitter_1.default));
exports.default = Renderer;
