import Taro from '@tarojs/taro';
import BaseComponent from "../../BaseComponent";
import {View, Text, Image} from '@tarojs/components';
import PropTypes from 'prop-types';
import { ossUrl } from "../../../config";
import './index.scss';

const right_arrow = ossUrl + 'upload/images/recode/right_arrow.png.png';

/**
 * 新增档案-item-组件
 */
class ItemRecordAdd extends BaseComponent {
  static propTypes = {
    index: PropTypes.number,
    item: PropTypes.object,
    onItemClick: PropTypes.func,
  }

  static defaultProps = {
    item: '',
  };

  onItemClick = (e) => {
    let index = e.currentTarget.dataset.index;
    this.log('onItemClick index=' + index);
    this.props.onItemClick(index);
  }

  render() {
    const {index, item} = this.props;
    this.log('ItemRecordAdd render index=' + index + ',item=' + item.value)
    this.log(item)
    console.log(item)
    return (

      <View
        className='item-con'
        data-index={index}
        onClick={this.onItemClick}
      >
        <View className='left-con'>
          {/* <Image
            className='icon-left'
            src={item.img}
          /> */}
          <Text className='name'>{item.name}</Text>
        </View>
        <View className='right-con'>
          {item.value_name && (
            <View className='value'>{item.value_name}</View>
          )}
          {(!item.value || item.value == '0,0,0') && (
            // <View className='iconfont icon-arrow-right arrow'></View>
            <View className='arrow'>
              <Image className='right_arrow' src={right_arrow}></Image>
            </View>
          )}
        </View>
      </View>
    )
  }
}

export default ItemRecordAdd;
