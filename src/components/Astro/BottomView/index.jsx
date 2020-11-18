import Taro from '@tarojs/taro';
import BaseComponent from "../../BaseComponent";
import {View, Image} from '@tarojs/components';
import './index.scss';
import {getSelfRecord, goToCommonPage} from "../../../utils/common";
import {PAGES, URL_ASTRO_EXPLAIN} from "../../../utils/constants";
import {ossUrl} from "../../../config";
import {Encrypt} from "../../../utils/request";
import PropTypes from "prop-types";

const img_bottom_view_astro_explain = ossUrl + 'wap/images/astro/img_bottom_view_astro_explain.png'
const img_bottom_view_natal_forecast = ossUrl + 'wap/images/astro/img_bottom_view_natal_forecast.png'

/**
 *  星盘 或者 合盘-底部的八字、占卜按钮和本命预测、星盘解读按钮 组件
 */
class BottomView extends BaseComponent {
  static propTypes = {
    rid: PropTypes.string,
  }

  static defaultProps = {
    rid: getSelfRecord().id
  };

  constructor() {
    super(...arguments)
    this.state = {}
  }

  componentDidMount = () => {
  }

  componentDidUpdate = () => {
  }

  actionCommonClick = (e) => {
    let id = e.currentTarget.dataset.id;
    this.log('actionCommonClick id=' + id);
    switch (Number(id)) {
      case 0: {//八字
        goToCommonPage(PAGES.PAGE_HOROSCOPE,'?rid='+this.props.rid);
        break;
      }
      case 1: {//占卜
        goToCommonPage(PAGES.PAGE_DIVINATION);
        break;
      }
      case 2: {//本命预测
        goToCommonPage(PAGES.PAGE_PREDICT, '?rid=' + this.props.rid);
        break;
      }
      case 3: {//星盘解读
        let token = Encrypt('rid=' + this.props.rid);
        this.log(token)
        //window.location.href = URL_ASTRO_EXPLAIN + '?token=' + token;
        break;
      }
    }
  }

  render() {
    return (
      <View className='bottom-con'>
        <View className='top-con'>
          <View className='btn' data-id={0} onClick={this.actionCommonClick}>八字</View>
          <View className='sep'></View>
          <View className='btn' data-id={1} onClick={this.actionCommonClick}>占卜</View>
        </View>
        <View className='bottom-con'>
          <View className='item-btn-con' data-id={2} onClick={this.actionCommonClick}>
            <Image
              className='img'
              src={img_bottom_view_natal_forecast}
            />
            <View className='text blue'>本命预测</View>
          </View>
          <View className='sep'></View>
          <View className='item-btn-con' data-id={3} onClick={this.actionCommonClick}>
            <Image
              className='img'
              src={img_bottom_view_astro_explain}
            />
            <View className='text'>星盘解读</View>
          </View>
        </View>
      </View>
    )
  }
}

export default BottomView;
