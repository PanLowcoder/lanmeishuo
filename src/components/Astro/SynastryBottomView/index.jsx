import Taro from '@tarojs/taro';
import BaseComponent from "../../BaseComponent";
import {View, Image} from '@tarojs/components';
import './index.scss';
import {ossUrl} from "../../../config";
import PropTypes from "prop-types";
import {getNameFromRecord} from "../../../utils/common";
import { ASTRO_SYNASTRY_TYPES } from '../../../utils/astrolabe';

const img_bottom_view_natal_forecast = ossUrl + 'wap/images/astro/img_bottom_view_natal_forecast.png'

/**
 *  合盘-底部的 "rid1 in rid2" 和 合盘阶段- 组件
 */
class SynastryBottomView extends BaseComponent {
  static propTypes = {
    astro_synastry_type: PropTypes.number,
    record1: PropTypes.object,
    record2: PropTypes.object,
  }

  static defaultProps = {};

  constructor() {
    super(...arguments)
    this.state = {}
  }

  componentDidMount = () => {
  }

  componentDidUpdate = () => {
  }

  //底部的合盘解读点击事件
  actionSynastryBtnClick = () => {
    this.log('actionSynastryBtnClick')
    Taro.navigateTo({
      url: '/pages/synastry/synastryDetail/index?rid1=' +
        ((ASTRO_SYNASTRY_TYPES.SYNASTRY_2 == this.props.astro_synastry_type) ?
          this.props.record2.id : this.props.record1.id)
        + '&rid2=' +
        ((ASTRO_SYNASTRY_TYPES.SYNASTRY_2 == this.props.astro_synastry_type) ?
          this.props.record1.id : this.props.record2.id)
    })
  }

  render() {

    const {
      record1,
      record2,
      astro_synastry_type,
    } = this.props

    if (!record1 || !record2)
      return
    let title = ''
    if (ASTRO_SYNASTRY_TYPES.SYNASTRY_2 == astro_synastry_type) {
      title = getNameFromRecord(record1) + ' in ' + getNameFromRecord(record2)
    } else if (ASTRO_SYNASTRY_TYPES.SYNASTRY_1 == astro_synastry_type) {
      title = getNameFromRecord(record2) + ' in ' + getNameFromRecord(record1)
    } else if (ASTRO_SYNASTRY_TYPES.COMPOSITE == astro_synastry_type || ASTRO_SYNASTRY_TYPES.DAVISON == astro_synastry_type) {
      title = getNameFromRecord(record1) + ' 和 ' + getNameFromRecord(record2)
    } else if (ASTRO_SYNASTRY_TYPES.MARKS_1 == astro_synastry_type) {
      title = getNameFromRecord(record1) + '* 和 ' + getNameFromRecord(record2)
    } else if (ASTRO_SYNASTRY_TYPES.MARKS_2 == astro_synastry_type) {
      title = getNameFromRecord(record1) + ' 和 ' + getNameFromRecord(record2) + '*'
    }

    this.log('SynastryBottomView render record1.name=' + getNameFromRecord(record1) + ',record2.name=' + getNameFromRecord(record2))

    return (
      <View className='synastry-bottom-con'>
        <View className='top-con'>{title}</View>
        <View className='bottom-con'>
          {(
            ASTRO_SYNASTRY_TYPES.SYNASTRY_1 == astro_synastry_type ||
            ASTRO_SYNASTRY_TYPES.SYNASTRY_2 == astro_synastry_type
          ) && (
            <View className='item-btn-con' onClick={this.actionSynastryBtnClick}>
              <Image
                className='img'
                src={img_bottom_view_natal_forecast}
              />
              <View className='text blue'>合盘解读</View>
            </View>
          )}
        </View>
      </View>
    )
  }
}

export default SynastryBottomView;
