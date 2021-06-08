import Taro, {Component} from '@tarojs/taro'
import {Canvas} from '@tarojs/components'
import PropTypes from 'prop-types';
import Renderer from './lib/renderer';
import F2 from '@antv/f2'
import './f2-canvas.scss'


function wrapEvent(e) {
  if (!e) return;
  if (!e.preventDefault) {
    e.preventDefault = function() {};
  }
  return e;
}

function randomStr (long) {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
  const maxPos = chars.length;
  var string = '';
  for (var i = 0; i < long; i++) {
    string += chars.charAt(Math.floor(Math.random() * maxPos));
  }
  return string;
}

export default class F2Canvas extends Component {

  static defaultProps = {
    onInit: () => {},
  }

  id = 'f2-canvas-' + randomStr(16)

  componentDidMount () {
    setTimeout(()=>{
      let query = Taro.createSelectorQuery().in(this.$scope)
    
     query.selectAll('#'+ this.id).fields({ node: true, size: true, context: true })
      .exec(res => {

        console.log(res)
        const { node, width, height } = res[0];
        const context = node.getContext('2d');
        console.log(context)

        const pixelRatio = wx.getSystemInfoSync().pixelRatio;
        // 高清设置
        node.width = width * pixelRatio;
        node.height = height * pixelRatio;

        const config = { context, width, height, pixelRatio };
        const chart = this.props.onInit(F2, config);
        if (chart) {
          this.chart = chart;
          this.canvasEl = chart.get('el');
        }
      });
    },100)
  }

  touchStart(e){
    const canvasEl = this.canvasEl
    if (canvasEl) {
      canvasEl.dispatchEvent('touchstart', wrapEvent(e));
    }
  }
  touchMove(e){
    const canvasEl = this.canvasEl
    if (canvasEl) {
      canvasEl.dispatchEvent('touchmove', wrapEvent(e));
    }
  }
  touchEnd(e){
    const canvasEl = this.canvasEl
    if (canvasEl) {
      canvasEl.dispatchEvent('touchend', wrapEvent(e));
    }
  }

  render () {
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