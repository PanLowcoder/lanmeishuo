import Taro from '@tarojs/taro';
import BaseComponent from "../../BaseComponent";
import {View, Image} from '@tarojs/components';
import PropTypes from 'prop-types';
import './index.scss';
import {ASTRO_MODAL_RECORDS, PAGES} from "../../../utils/constants";
import {goToCommonPage, showToast} from "../../../utils/common";

/**
 *  星盘导航栏右侧按钮弹出的编辑、添加、切换、分享档案 - alert组件
 */
class AstroRecordModal extends BaseComponent {
  static propTypes = {
    type: PropTypes.number,//0：星盘页面的；1：八字页面的；2：合盘页面的；
    show: PropTypes.bool,//是否显示alert
    rid: PropTypes.string,
    onClickAlertShadow: PropTypes.func,//点击阴影部分
  }

  static defaultProps = {
    type: 0,
    show: 0,
  };

  constructor() {
    super(...arguments)
    this.state = {}
  }

  componentDidMount = () => {
  }

  componentDidUpdate = () => {

  }

  actionItemClick = (e) => {
    let index = e.currentTarget.dataset.index;
    this.log('actionItemClick index=' + index);
    if (0 == index) {//编辑档案
      Taro.navigateTo({url: '/pages/record/recordAdd/index?type=1&rid=' + this.props.rid})
    } else if (1 == index) {//添加档案
      Taro.navigateTo({
        url: '/pages/record/recordAdd/index?type=0'
      })
    } else if (2 == index) {//切换档案
      goToCommonPage(PAGES.PAGE_RECORD_SELECT, '?type=1');
    } else if (3 == index) {//分享档案
      showToast('未完成');
    }
    this.props.onClickAlertShadow();
  }

  actionBgClick = () => {
    this.log('actionBgClick');
    this.props.onClickAlertShadow();
  }

  render() {
    const {
      type,
      show
    } = this.props;

    return (
      <View>
        {show && (
          <View className='astro-modal-con'>
            <View className='shandow-con' onClick={this.actionBgClick}> </View>
            <View className='astro-content-con'>
              <View className='con'>
                {ASTRO_MODAL_RECORDS.map((item, index) => (
                  <View>
                    {((type == 1 && index != 3) || type == 0 || (type==2&&index!=0)) && (
                      <View className='item-con' data-index={index} onClick={this.actionItemClick}>
                        <Image className='img' src={item.img}></Image>
                        <View className='title'>{item.name}</View>
                      </View>
                    )}
                  </View>
                ))}
              </View>
            </View>
          </View>
        )
        }
      </View>
    );
  }
}

export default AstroRecordModal;
