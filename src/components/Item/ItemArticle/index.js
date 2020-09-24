import Taro from '@tarojs/taro';
import BaseComponent from "../../BaseComponent";
import { View, Text, Image } from '@tarojs/components';
import PropTypes from 'prop-types';
import { ossUrl } from "../../../config";
import './index.less';
import { customTime, getCustomImgUrl } from "../../../utils/common";

//图片
const img_good_normal = ossUrl + 'wap/images/article/img_good_normal.png';
const img_good_selected = ossUrl + 'wap/images/article/img_good_selected.png';
const img_read_normal = ossUrl + 'wap/images/article/img_read_normal.png';
const img_read_selected = ossUrl + 'wap/images/article/img_read_selected.png';
const img_hot = ossUrl + 'wap/images/article/img_hot.png';


/**
 * 文章列表单条内容组件
 */
class ItemArticle extends BaseComponent {
  static propTypes = {
    item: PropTypes.array,
    index: PropTypes.number,
  }

  static defaultProps = {
    item: '',
  };

  gotoDetail = (e) => {
    Taro.navigateTo({
      url: `/pages/articleDetail/index?id=${e.currentTarget.dataset.id}`,
    })
  }

  render() {
    const { item } = this.props;
    return (

      <View className='articles-li' data-id={item.id} onClick={this.gotoDetail}>
        <View className='item_container'>
          <View className='title-con'>
            <View className='title'>{item.title}</View>
            {item.is_hot == 1 && (<Image
              className='img-hot'
              src={img_hot}
            />)}
          </View>
          <View className='des'>{item.introduction}</View>
          <Image
            className='img'
            src={ossUrl + item.thumb}
          />
          {/*底部作者、时间、点赞、阅读部分*/}
          <View className='bottom-con '>
            <View className='left-con'>
              <Image
                className='at-col-1 img'
                src={getCustomImgUrl(item.avatar)}
              />
              <View className='author'>{item.author}</View>
              <Text className='time'>{customTime(item.publish_time, 13)}</Text>
            </View>


            <View className='right-con'>
              {/*点赞数*/}
              <View className='zan-or-good-con'>
                <Image
                  className='img'
                  src={item.good_status ? img_good_selected : img_good_normal}
                />
                <Text className={!item.good_status ? "zan-text" : 'text selected'}>{item.good}</Text>
              </View>
              {/*阅读数*/}
              <View className='zan-or-good-con margin-left-con'>
                <Image
                  className='img'
                  src={item.is_read ? img_read_selected : img_read_normal}
                />
                <View className={!item.is_read ? "zan-text" : "zan-text selected"}>{item.read}</View>
              </View>
            </View>
          </View>
          {/*底部分割线*/}
          <View className='sperate_line'></View>
        </View>

      </View>

    )
  }
}

export default ItemArticle;
