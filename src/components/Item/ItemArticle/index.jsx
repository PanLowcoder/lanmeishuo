import Taro from '@tarojs/taro';
import BaseComponent from "../../../components/BaseComponent";
import { View, Text, Image, Icon } from '@tarojs/components';
import PropTypes from 'prop-types';
import { AtAvatar } from 'taro-ui';
import './index.less';
import { customTime, getCustomImgUrl } from "../../../utils/common";
import { ossUrl } from '../../../config';

const heart = ossUrl + 'upload/images/home/Star_Heart.png';
const star = ossUrl + 'upload/images/home/Star_Star.png';
const chat = ossUrl + 'upload/images/home/Star_Chat.png';


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
        <View className="article-title">
          <View className="title-text">{item.title}</View>
          {/* <View className="title-time">{item.created_at}</View> */}
        </View>
        <Image
          className='article-img'
          mode='widthFix'
          src={ossUrl + item.img}
          style="width:100%"
        />
        <View className="article-footer">
          <View className='left-con'>
            <AtAvatar circle size='small' className='left-img'></AtAvatar>
            <View className='author'>{item.id}</View>
          </View>

          <View className='right-con'>
            {/*点赞数*/}
            <View className='tab'>
              <Image
                className='icon-img'
                src={heart}
              />
              <View className='icon-text'>{item.watch}</View>
            </View>
            {/*收藏数*/}
            <View className='tab'>
              <Image
                className='icon-img'
                src={star}
              />
              <View className='icon-text'>{item.watch}</View>
            </View>
            {/*评论数*/}
            <View className='tab'>
              <Image
                className='icon-img'
                src={chat}
              />
              <View className='icon-text'>{item.watch}</View>
            </View>
          </View>
        </View>
      </View>

    )
  }
}

export default ItemArticle;
