import Taro from '@tarojs/taro';
import BaseComponent from "../../BaseComponent";
import { View, Image } from '@tarojs/components';
import { AtButton, AtRate } from 'taro-ui';
import PropTypes from 'prop-types';
import './index.less';
import { ossUrl } from "../../../config";
import { getCustomImgUrl, goToCommonPage } from "../../../utils/common";
import { HOME_ALERT_TYPE } from "../../../pages/tabs/tabHome";
import { PAGES } from "../../../utils/constants";

/**
 *  首页**之日 - alert组件
 */
class HomeReviveDayModal extends BaseComponent {
  static propTypes = {
    data: PropTypes.object,//数据
    show: PropTypes.bool,//是否显示alert
    onClickAlertShadow: PropTypes.func,//点击阴影部分
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

  //黑色透明背景点击事件
  actionBgClick = () => {
    this.log('actionBgClick');
    if (4 == this.props.data.type)
      return;
    this.props.onClickAlertShadow(HOME_ALERT_TYPE.REVIVE_DAY)
  }

  //底部按钮被点击
  actionBtnClick = () => {
    this.log('actionBtnClick')
    goToCommonPage(PAGES.PAGE_DAY)
    this.props.onClickAlertShadow(HOME_ALERT_TYPE.REVIVE_DAY)
  }

  render() {
    const {
      show,
      data,
    } = this.props;

    if (!data)
      return

    this.log('HomeReviveDayModal render show=' + show)

    return (
      <View>
        {show && (
          <View className='home-revive-day-modal-con'>
            <Image
              className='img-notice'
              src={getCustomImgUrl(data.icon_url)}
            />
            <View className='info-con'>
              <View className='content-con'>
                <View className='top-con'>
                  <View className='title'>{data.name}</View>
                  <AtRate
                    className='day-rate'
                    size='20'
                    max={3}
                    value={data.star_level}
                  />
                </View>
                {/*内容*/}
                <View className='content'>{data.tips}</View>
                {/*按钮*/}
                <View className='btn-con'>
                  <AtButton className='btn' onClick={this.actionBtnClick}>查看运势详情</AtButton>
                </View>

              </View>
            </View>
            {/*关闭按钮 4.每次都弹，不能关闭，没有关闭按钮（比如系统升级中等）；】*/}
            {4 != data.type && (
              <Image
                className='img-close'
                src={ossUrl + 'wap/images/rectification/icon_alert_cancle.png'}
                onClick={this.actionBgClick}
              />
            )}
            {/*黑色透明背景*/}
            <View
              className='info-shandow-con'
              onClick={this.actionBgClick}
            />
          </View>
        )
        }
      </View>
    );
  }
}

export default HomeReviveDayModal;
