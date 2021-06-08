import Taro, {Component} from '@tarojs/taro'
import {Canvas} from '@tarojs/components'
import PropTypes from 'prop-types';
import Renderer from './lib/renderer';
import './f2-canvas.css';


interface F2CanvasPropTypes {
  onCanvasInit: (canvas: any, width: number, height: number) => any,
}

function randomStr(long: number): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
  const maxPos = chars.length;
  var string = '';
  for (var i = 0; i < long; i++) {
    string += chars.charAt(Math.floor(Math.random() * maxPos));
  }
  return string;
}

export default class F2Canvas extends Component<F2CanvasPropTypes> {
  static defaultProps = {
    onCanvasInit: () => {
    },
  };
  static propTypes = {
    onCanvasInit: PropTypes.any,
  };

  state = {
    width: '100%',
    height: '100%;',
  };

  id: string = 'f2-canvas-' + randomStr(16);
  canvas: any;
  static fixF2: (F2: any) => any;

  componentWillMount() {
    if (process.env.TARO_ENV !== 'h5') {
      setTimeout(() => {
        const query = Taro.createSelectorQuery().in(this.$scope);
        query.select('#' + this.id).boundingClientRect().exec(res => {
          const ctx = Taro.createCanvasContext(process.env.TARO_ENV === 'weapp' ? 'f2-canvas' : this.id, this.$scope);
          const canvasWidth = res[0].width;
          const canvasHeight = res[0].height;
          const canvas = new Renderer(ctx, process.env.TARO_ENV);
          this.canvas = canvas;
          this.props.onCanvasInit(canvas, canvasWidth, canvasHeight);
        });
      }, 1)
    }
  }

  componentDidMount() {
  }

  componentWillUnmount() {
  }

  componentDidShow() {
  }

  componentDidHide() {
  }

  touchStart(e) {
    if (this.canvas) {
      this.canvas.emitEvent('touchstart', [e]);
    }
  }

  touchMove(e) {
    if (this.canvas) {
      this.canvas.emitEvent('touchmove', [e]);
    }
  }

  touchEnd(e) {
    if (this.canvas) {
      this.canvas.emitEvent('touchend', [e]);
    }
  }

  press(e) {
    if (this.canvas) {
      this.canvas.emitEvent('press', [e]);
    }
  }

  htmlCanvas(canvas) {
    if (!canvas) return;
    setTimeout(() => {
      this.canvas = canvas;
      this.props.onCanvasInit(canvas, canvas.offsetWidth, canvas.offsetHeight)
    }, 1)
  }

  render() {
    const id = this.id;
    if (process.env.TARO_ENV === 'h5') {
      return <canvas ref={this.htmlCanvas.bind(this)} className={'f2-canvas ' + id}></canvas>
    }
    if (process.env.TARO_ENV !== 'h5') {
      return <Canvas
        style={'width: ' + this.state.width + '; height:' + this.state.height}
        className='f2-canvas' canvasId='f2-canvas'
        id={id}
        onTouchStart={this.touchStart.bind(this)}
        onTouchMove={this.touchMove.bind(this)}
        onTouchEnd={this.touchEnd.bind(this)}
        onLongPress={this.press.bind(this)}
      />;
    }
  }
}

function strLen(str) {
  let len = 0;
  for (let i = 0; i < str.length; i++) {
    if (str.charCodeAt(i) > 0 && str.charCodeAt(i) < 128) {
      len++;
    } else {
      len += 2;
    }
  }
  return len;
}

F2Canvas.fixF2 = function (F2: any): any {
  if ((!F2) || F2.TaroFixed) {
    return F2
  }
  if (process.env.TARO_ENV !== 'h5') {


    F2.Util.measureText = function (text, font, ctx) {
      if (!ctx) {
        let fontSize = 12;
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
      const type = event.type;
      let x = 0;
      let y = 0;
      const touches = event.touches;
      if (touches && touches.length > 0) {
        x = touches[0].x;
        y = touches[0].y;
      }
      return {
        type,
        chart,
        x,
        y
      };
    };
    if (Taro && Taro.getSystemInfoSync) {
      const systeamInfo = Taro.getSystemInfoSync();
      if (systeamInfo && systeamInfo.pixelRatio) {
        F2.Global.pixelRatio = systeamInfo.pixelRatio
      }
    }
  } else {
    F2.Global.pixelRatio = window.devicePixelRatio
  }
  F2.TaroFixed = true;
  return F2
}
