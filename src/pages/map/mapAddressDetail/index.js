import Taro from '@tarojs/taro';
import BaseComponent from "../../../components/BaseComponent";
import {View, Image} from '@tarojs/components';
import './index.scss';
import {AtNavBar} from "taro-ui";
import {actionNavBack, getCustomImgUrl} from '../../../utils/common'
import {map_address_cancel_collect, map_address_collect, map_detail} from "../service";

// import F2Canvas from "../../../components/f2-canvas/f2-canvas";
// const F2 = require("@antv/f2");

import {ossUrl} from "../../../config";

const img_collect_normal = ossUrl + 'wap/images/article/img_collect_normal.png';
const img_collect_selected = ossUrl + 'wap/images/article/img_collect_selected.png';
const img_share = ossUrl + 'wap/images/article/img_share.png';

/**
 * 占星地图详情类型： 1：地址；2：命运之城
 * @type {{CITY: number, ADDRESS: number}}
 */
export const MAP_ADDRESS_DETAIL_PAGE_TYPE = {
  ADDRESS: 1,//地址
  CITY: 2,//命运之城
}

class mapAddressDetail extends BaseComponent {
  config = {
    navigationBarTitleText: '地址详情',
  };

  constructor() {
    super(...arguments)
    this.state = {
      type: MAP_ADDRESS_DETAIL_PAGE_TYPE.ADDRESS,
      rid: '',
      des: '',
      point_latitude: '',
      point_longitude: '',
      detail: '',//网络请求的详情内容

    }
  }

  componentWillReceiveProps = () => {

  }

  componentDidUpdate = () => {
  }

  componentDidMount = () => {
    let type = this.$router.params.type;
    let rid = this.$router.params.rid;
    let des = this.$router.params.des;
    let current_latitude = this.$router.params.current_latitude;
    let current_longitude = this.$router.params.current_longitude;
    let point_latitude = this.$router.params.point_latitude;
    let point_longitude = this.$router.params.point_longitude;

    //test
    // current_latitude = 39.8988633897
    // current_longitude = 116.5521728515625
    // point_latitude = 26.64
    // point_longitude = 106.630444
    // rid = getSelfRecord().id;
    // type = 2
    // des = 'test'
    //test

    this.setState({type, rid, des, point_latitude, point_longitude})

    //请求网络
    this.requestDetail(type, rid, current_latitude, current_longitude, point_latitude, point_longitude);
  }

  //收藏或者取消收藏按钮被点击
  actionCollectBtnClick = (e) => {
    let des = this.state.des;
    if (MAP_ADDRESS_DETAIL_PAGE_TYPE.CITY == this.state.type) {
      des = e.currentTarget.dataset.des;
    }
    //test
    if (!des) {
      des = 'test';
    }
    //test
    this.log('actionCollectBtnClick')
    if (this.state.detail.is_collect == 'true') {//取消收藏
      this.requestCollectCancel(this.state.rid, this.state.detail.collect_id);
    } else {//收藏
      this.requestCollect(this.state.type, this.state.rid, this.state.detail.name, des, this.state.point_latitude, this.state.point_longitude);
    }
  }

  //分享按钮被点击
  actionShareBtnClick = () => {
    this.log('actionShareBtnClick')
  }


  // initChart (canvas, width, height) {
  //   F2Canvas.fixF2(F2);
  //   const Shape = F2.Shape;
  //   const data = [
  //     { pointer: '当前收益', value: 5, length: 2, y: 1.05 }
  //   ];
  //   //自定义绘制数据的的形状
  //   Shape.registerShape('point', 'dashBoard', {
  //     getPoints: function (cfg) {
  //       const x = cfg.x;
  //       const y = cfg.y;
  //
  //       return [
  //         { x: x, y: y },
  //         { x: x, y: 0.4 }
  //       ];
  //     },
  //     draw: function (cfg, container) {
  //       let point1 = cfg.points[0];
  //       let point2 = cfg.points[1];
  //       point1 = this.parsePoint(point1);
  //       point2 = this.parsePoint(point2);
  //
  //       const line = container.addShape('Polyline', {
  //         attrs: {
  //           points: [point1, point2],
  //           stroke: '#1890FF',
  //           lineWidth: 2
  //         }
  //       });
  //
  //       const text = cfg.origin._origin.value.toString();
  //       const text1 = container.addShape('Text', {
  //         attrs: {
  //           text: text + '%',
  //           x: cfg.center.x,
  //           y: cfg.center.y,
  //           fill: '#1890FF',
  //           fontSize: 24,
  //           textAlign: 'center',
  //           textBaseline: 'bottom'
  //         }
  //       });
  //       const text2 = container.addShape('Text', {
  //         attrs: {
  //           text: cfg.origin._origin.pointer,
  //           x: cfg.center.x,
  //           y: cfg.center.y,
  //           fillStyle: '#ccc',
  //           textAlign: 'center',
  //           textBaseline: 'top'
  //         }
  //       });
  //
  //       return [line, text1, text2];
  //     }
  //   });
  //
  //   const chart = new F2.Chart({
  //     el: canvas,
  //     width,
  //     height,
  //     animate: false
  //   });
  //   chart.source(data, {
  //     value: {
  //       type: 'linear',
  //       min: 0,
  //       max: 15,
  //       ticks: [0, 5, 7.5, 10, 15],
  //       nice: false
  //     },
  //     length: { type: 'linear', min: 0, max: 10 },
  //     y: { type: 'linear', min: 0, max: 1 }
  //   });
  //
  //   chart.coord('polar', {
  //     inner: 0,
  //     startAngle: -1.25 * Math.PI,
  //     endAngle: 0.25 * Math.PI,
  //     radius: 0.8
  //   });
  //
  //   //配置value轴刻度线
  //   chart.axis('value', {
  //     tickLine: {
  //       strokeStyle: '#ccc',
  //       lineWidth: 2,
  //       length: -5
  //     },
  //     label: null,
  //     grid: null,
  //     line: null
  //   });
  //
  //   chart.axis('y', false);
  //
  //   //绘制仪表盘辅助元素
  //   chart.guide().arc({
  //     start: [0, 1.05],
  //     end: [4.8, 1.05],
  //     style: {
  //       strokeStyle: '#1890FF',
  //       lineWidth: 5,
  //       lineCap: 'round'
  //     }
  //   });
  //   chart.guide().arc({
  //     start: [5.2, 1.05],
  //     end: [9.8, 1.05],
  //     style: {
  //       strokeStyle: '#ccc',
  //       lineWidth: 5,
  //       lineCap: 'round'
  //     }
  //   });
  //   chart.guide().arc({
  //     start: [10.2, 1.05],
  //     end: [15, 1.05],
  //     style: {
  //       strokeStyle: '#ccc',
  //       lineWidth: 5,
  //       lineCap: 'round'
  //     }
  //   });
  //   chart.guide().arc({
  //     start: [0, 1.2],
  //     end: [15, 1.2],
  //     style: {
  //       strokeStyle: '#ccc',
  //       lineWidth: 1
  //     }
  //   });
  //
  //   chart.guide().text({
  //     position: [-0.5, 1.3],
  //     content: '0.00%',
  //     style: {
  //       fillStyle: '#ccc',
  //       font: '18px Arial',
  //       textAlign: 'center'
  //     }
  //   });
  //   chart.guide().text({
  //     position: [7.5, 0.7],
  //     content: '7.50%',
  //     style: {
  //       fillStyle: '#ccc',
  //       font: '18px Arial',
  //       textAlign: 'center'
  //     }
  //   });
  //   chart.guide().text({
  //     position: [15.5, 1.3],
  //     content: '15.00%',
  //     style: {
  //       fillStyle: '#ccc',
  //       font: '18px Arial',
  //       textAlign: 'center'
  //     }
  //   });
  //
  //   chart.point().position('value*y')
  //     .size('length')
  //     .color('#1890FF')
  //     .shape('dashBoard');
  //   chart.render();
  //   return chart;
  // }

  render() {

    //TODO 画仪表盘

    const {
      type,
      detail
    } = this.state;

    let fate_city_title_ext = '';
    if (type == MAP_ADDRESS_DETAIL_PAGE_TYPE.CITY && detail && detail.explain_list.length > 0) {
      detail.explain_list.map((item, index) => {
        if (item.name) {
          if (index == 0)
            fate_city_title_ext = '('
          fate_city_title_ext += item.name + '、';
          if (index == detail.explain_list.length - 1) {
            fate_city_title_ext = fate_city_title_ext.substr(0, fate_city_title_ext.length - 2);
            fate_city_title_ext += ')';
          }
        }
      })
    }


    return (
      <View className='map-detail-page'>

        {/*导航栏*/}
        <AtNavBar
          className='nav'
          onClickLeftIcon={this.actionNavBack}
          color='#000'
          title={detail && detail.name}
          leftIconType='chevron-left'
          fixed
        />

        {/*底部内容*/}
        {detail && (
          <View className='content-con'>
            {/*分隔块*/}
            <View className='separate_block'></View>

            {/*标题内容部分*/}
            <View className='top-con'>
              <View className='text-title'>{detail.name + fate_city_title_ext}</View>
              <View className='text-distance'>距我{detail.distance}</View>
              {/*得分部分*/}
              <View className='score-con'>
                {detail.score_list.length > 0 && detail.score_list.map((item) => (
                  <View className='item-con'>
                    <View className='text-name'>{item.name}:</View>
                    <View className='text-score' style={'color:' + item.color}>{item.percent}</View>
                  </View>
                ))}
              </View>
              {/*收藏&分享部分*/}
              <View className='collect-and-share-con'>
                <View className='collect-item-con' data-des={fate_city_title_ext} onClick={this.actionCollectBtnClick}>
                  <Image className='img-collect' src={detail.is_collect == 'true' ? img_collect_selected : img_collect_normal}></Image>
                  <View className='text-collect'>收藏改地点</View>
                </View>
                <View className='collect-item-con' onClick={this.actionShareBtnClick}>
                  <Image className='img-collect' src={img_share}></Image>
                  <View className='text-collect'>分享给朋友</View>
                </View>
              </View>
            </View>

            <View className='separate_block'></View>

            {/*地点说明部分（只有命运之城有）*/}
            {detail.explain_list && (
              <View className='fate-city-con'>
                <View className='text-header'>地点说明</View>
                {detail.explain_list.map((item) => (
                  <View className='city-item-con'>
                    <Image className='img-city' src={getCustomImgUrl(item.icon)}></Image>
                    <View className='city-right-con'>
                      <View className='text-city-name'>{item.name}</View>
                      <View className='text-city-des'>{item.description}</View>
                    </View>

                  </View>
                ))}
                {/* 全部展开部分*/}

              </View>
            )}

            {/*位置推荐部分*/}
            <View className='recommend-con'>
              <View className='text-header'>位置推荐</View>
              <View className='recommend-score-con'>
                {detail.recommend_list && detail.recommend_list.map((item) => (
                  <View className='recommend-item-con'>
                    <Image className='img-recommend' src={getCustomImgUrl(item.icon)}></Image>
                    {/*<F2Canvas onCanvasInit={this.initChart.bind(this)}></F2Canvas>*/}
                    <View className='recommend-bottom-con'>
                      <View className='text-name'>{item.name}</View>
                      <View className='text-status'>{item.status}</View>
                    </View>
                  </View>
                ))}
              </View>
            </View>

          </View>
        )}
      </View>
    )
  }

  /**
   * 网络请求-获取地点详情
   * @param type
   * @param rid
   * @param current_latitude
   * @param current_longitude
   * @param point_latitude
   * @param point_longitude
   * @returns {Promise<void>}
   */
  async requestDetail(type, rid, current_latitude, current_longitude, point_latitude, point_longitude) {
    let res = await map_detail({
      type, rid, current_latitude, current_longitude, point_latitude, point_longitude
    })
    if (res.code == '200') {
      this.setState({detail: res.data})
    }
  }

  /**
   * 取消收藏
   * @param type
   * @param ids
   * @returns {Promise<void>}
   */
  async requestCollectCancel(type, ids) {
    let res = await map_address_cancel_collect({
      type, ids
    })
    if (res.code == '200') {
      let detail = this.state.detail;
      if (detail.is_collect == 'true') {
        detail.is_collect = 'false';
      } else {
        detail.is_collect = 'true';
      }
      this.setState({detail})
    }
  }

  /**
   * 收藏
   * @param type
   * @param ids
   * @returns {Promise<void>}
   */
  async requestCollect(type, rid, name, des, latitude, longitude) {
    let res = await map_address_collect({
      type, rid, name, des, latitude, longitude
    })
    if (res.code == '200') {
      let detail = this.state.detail;
      if (detail.is_collect == 'true') {
        detail.is_collect = 'false';
      } else {
        detail.is_collect = 'true';
      }
      detail.collect_id = res.data;//把收藏返回的id赋值给detail（取消收藏的时候用到）
      this.setState({detail})
    }
  }
}

export default mapAddressDetail;
