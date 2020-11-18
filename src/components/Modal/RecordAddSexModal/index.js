import Taro from '@tarojs/taro';
import BaseComponent from "../../BaseComponent";
import {Image, View} from '@tarojs/components';
import {AtModal, AtModalContent} from "taro-ui"
import PropTypes from 'prop-types';
import './index.scss';
import {ossUrl} from "../../../config";

const img_radio_selected = ossUrl + "wap/images/common/img_radio_selected.png";
const img_radio_normal = ossUrl + "wap/images/common/img_radio_normal.png";

/**
 *  新增档案-性别选择-alert组件
 */
class RecordAddSexModal extends BaseComponent {
  static propTypes = {
    show: PropTypes.bool,
    sex: PropTypes.number,//选中的性别：1：男；2：女；5：事件；
    record_add_sex_list: PropTypes.array,
    onSexItemClick: PropTypes.func,
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

  actionModelSexItem = (e) => {
    let index = e.currentTarget.dataset.index;
    this.log('actionModelSexItem index=' + index);
    this.props.onSexItemClick(index);
  }


  render() {
    const {show, record_add_sex_list, sex} = this.props;

    return (
      <AtModal
        isOpened={show}
      >

        <AtModalContent className='sex_modal'>
          <View className='title'>性别 | 类别</View>
          <View className='list'>
            {
              record_add_sex_list.map((item, index) =>
                (
                  <View className='item' data-index={index} onClick={this.actionModelSexItem}>
                    <View className='left_text'>
                      {item.name}
                    </View>
                    <View className='right_container'>
                      <Image
                        className='right_img'
                        src={item.sex == sex ? img_radio_selected : img_radio_normal}
                      />
                    </View>
                  </View>
                ))
            }
          </View>
        </AtModalContent>

      </AtModal>
    );
  }
}

export default RecordAddSexModal;
