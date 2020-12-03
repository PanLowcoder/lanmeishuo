import Taro from '@tarojs/taro';
import BaseComponent from "../../BaseComponent";
import {View, Image} from '@tarojs/components';
import {AtModal, AtModalContent} from "taro-ui"
import PropTypes from 'prop-types';
import './index.scss';
import {ASTRO_MODAL_BGS} from "../../../utils/constants";
import {ossUrl} from "../../../config";

const img_radio_selected = ossUrl + 'wap/images/common/img_radio_selected.png'

/**
 *  星盘样式 alert组件
 */
class AstroTypeModal extends BaseComponent {
  static propTypes = {
    type: PropTypes.number,//星盘样式：0：中文；1：图标；
    style: PropTypes.number,//星盘类型：0：经典；1：专业；
    bg: PropTypes.number,//星盘风格
    show: PropTypes.bool,//是否显示alert
    onAlertCancleClick: PropTypes.func,
    onTypeClick: PropTypes.func,//星盘样式切换，0：星盘样式；1：星盘风格；2：星盘类型；
  }

  static defaultProps = {
    show: false,
  };

  constructor() {
    super(...arguments)
    this.state = {
    }
  }

  componentDidMount = () => {

  }

  componentDidUpdate = () => {
  }

  componentWillReceiveProps = () => {
  }

  onClose = () => {
    this.log('onClose');
    this.props.onAlertCancleClick();
  }

  actionTypeClick = (e) => {
    let id = e.currentTarget.dataset.id;
    this.log('actionTypeClick id=' + id)
    this.props.onTypeClick(0, id);
  }
  actionBgClick = (e) => {
    let id = e.currentTarget.dataset.id;
    this.log('actionBgClick id=' + id)
    this.props.onTypeClick(1, id);
  }
  actionStyleClick = (e) => {
    let id = e.currentTarget.dataset.id;
    this.log('actionStyleClick id=' + id)
    this.props.onTypeClick(2, id);
  }


  render() {
    const {show, type, bg, style} = this.props;
    this.log('AstroTypeModal render type=' + type + ',bg=' + bg + ',style=' + style);
    return (
      <AtModal
        className='astro-modal-con'
        isOpened={show}
        onClose={this.onClose}
      >
        <AtModalContent>
          <View className='content-con'>
            {/*星盘样式*/}
            <View className='item-con1'>
              <View className='title'>星盘样式</View>
              <View className='bottom-con1'>
                <View onClick={this.actionTypeClick} data-id={0} className={type == 1 ? 'item' : 'item selected'}>中文</View>
                <View onClick={this.actionTypeClick} data-id={1} className={type == 0 ? 'item' : 'item selected'}>图标</View>
              </View>
            </View>

            {/*星盘风格*/}
            <View className='item-con'>
              <View className='title'>星盘风格</View>
              <View className='bg-con'>
                {ASTRO_MODAL_BGS.map((item, index) => (
                  <View className='bg-item' onClick={this.actionBgClick} data-id={index}>
                    <Image className='img-bg' src={item}></Image>
                    {bg == index && (
                      <Image className='img-selected' src={img_radio_selected}></Image>
                    )}
                  </View>
                ))}
              </View>
            </View>

            {/*星盘类型*/}
            <View className='item-con2'>
              <View className='title'>星盘类型</View>
              <View className='bottom-con2'>
                <View
                  onClick={this.actionStyleClick}
                  data-id={0}
                  className={style != 0 ? 'item' : 'item selected'}
                >
                  经典
                </View>
                <View
                 onClick={this.actionStyleClick}
                data-id={1}
                 className={style == 0 ? 'item' : 'item selected'}
                >
                专业
                </View>
              </View>
            </View>
          </View>
        </AtModalContent>

      </AtModal>
    );
  }
}

export default AstroTypeModal;
