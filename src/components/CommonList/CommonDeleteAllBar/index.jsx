import Taro from '@tarojs/taro';
import BaseComponent from "../../BaseComponent";
import { View, Image } from '@tarojs/components';
import PropTypes from 'prop-types';
import './index.less';
import { ossUrl } from "../../../config";

const img_radio_selected = ossUrl + "wap/images/common/img_radio_selected.png";
const img_radio_normal = ossUrl + "wap/images/common/img_radio_normal.png";
const common_delete_normal = ossUrl + "wap/images/common/common_delete_normal.png";
const common_delete_selected = ossUrl + "wap/images/common/common_delete_selected.png";

/**
 * 通用的列表组件（自动加载）
 */
class CommonDeleteAllBar extends BaseComponent {
  static propTypes = {
    is_select_all: PropTypes.bool,//是否全选
    is_del_btn_enable: PropTypes.bool,//删除按钮是否可用
    onDeleteAllBarClick: PropTypes.func,//更多按钮被点击：0：全选按钮被点击；1：删除按钮被点击；
  }

  static defaultProps = {};


  constructor() {
    super(...arguments)
    this.state = {}
  }

  onDeleteAllBarClick = (e) => {
    let type = e.currentTarget.dataset.type;
    this.log('onDeleteAllBarClick type=' + type)
    this.props.onDeleteAllBarClick(type)
  }

  render() {
    const { is_select_all, is_del_btn_enable } = this.props;
    return (
      <View className='common-delete-all-con'>
        <View className='left-con' data-type={0} onClick={this.onDeleteAllBarClick}>
          <Image
            className='img-radio'
            src={is_select_all ? img_radio_selected : img_radio_normal}
          />
          <View className='text-all'>全选</View>
        </View>
        <View className='right-con' data-type={1} onClick={this.onDeleteAllBarClick}>
          <Image
            className='img-del'
            src={is_del_btn_enable ? common_delete_selected : common_delete_normal}
          />
          <View className={is_del_btn_enable ? 'text-delete text-delete-selected' : 'text-delete'}>删除</View>
        </View>
      </View>
    );
  }
}

export default CommonDeleteAllBar;
