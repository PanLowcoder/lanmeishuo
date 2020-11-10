import Taro from '@tarojs/taro';
import BaseComponent from "../../BaseComponent";
import {View} from '@tarojs/components';
import {AtModal, AtModalContent} from "taro-ui"
import PropTypes from 'prop-types';
import './index.scss';

/**
 *  八字alert组件
 */
class HoroscopeModal extends BaseComponent {
  static propTypes = {
    horoscope_time_type: PropTypes.number,//时间模式：0：北京时间；1：真太阳时；
    horoscope_time_start: PropTypes.number,//日辰初始：23：23点；0：24点；
    show: PropTypes.bool,//是否显示alert
    onAlertCancleClick: PropTypes.func,
    onTypeOrTimeChange: PropTypes.func,//时间模式或者日辰初始变化：0：时间模式；1：日辰初始；
  }

  static defaultProps = {
    show: false,
  };

  constructor() {
    super(...arguments)
    this.state = {}
  }

  componentDidMount = () => {
  }

  onClose = () => {
    this.log('onClose');
    this.props.onAlertCancleClick();
  }

  actionTimeTypeClick = (e) => {
    let id = e.currentTarget.dataset.id;
    this.log('date-id={time_type}  id=' + id);
    this.props.onTypeOrTimeChange(0, id);
  }

  actionTimeStartClick = (e) => {
    let id = e.currentTarget.dataset.id;
    this.log('date-id={time_start}  id=' + id);
    this.props.onTypeOrTimeChange(1, id);
  }

  render() {
    const {show, horoscope_time_type, horoscope_time_start} = this.props;

    return (
      <AtModal
        className='horoscope-modal-con'
        isOpened={show}
        onClose={this.onClose}
      >
        <AtModalContent className='content-con'>

          {/*时间模式：0：北京时间；1：真太阳时；*/}
          <View className='item-con1'>
            <View className='title'>时间模式</View>
            <View className='bottom-con'>
              <View
                onClick={this.actionTimeTypeClick}
                data-id={1}
                className={horoscope_time_type == 0 ? 'item' : 'item selected'}
              >
                真太阳时
              </View>
              <View
                onClick={this.actionTimeTypeClick}
                data-id={0}
                className={horoscope_time_type == 1 ? 'item' : 'item selected'}
              >
                北京时间
              </View>
            </View>
          </View>

          {/*日辰初始：23：23点；0：24点；*/}
          <View className='item-con2'>
            <View className='title'>日辰初始</View>
            <View className='bottom-con'>
              <View
                onClick={this.actionTimeStartClick}
                data-id={23}
                className={horoscope_time_start != 23 ? 'item' : 'item selected'}
              >
                23点
              </View>
              <View
                onClick={this.actionTimeStartClick}
                data-id={0}
                className={horoscope_time_start == 23 ? 'item' : 'item selected'}
              >
                24点
              </View>
            </View>
          </View>
        </AtModalContent>


      </AtModal>
    );
  }
}

export default HoroscopeModal;
