import Taro from '@tarojs/taro';
import { View, Text, Image, Icon } from '@tarojs/components';
import PropTypes from 'prop-types';
import { AtAvatar } from 'taro-ui'

import './index.less';
import { List } from '../../ArticleList';

import banner from '../../../images/home/banner.jpg';
import heart from '../../../images/home/Star_Heart.png';
import star from '../../../images/home/Star_Star.png';
import chat from '../../../images/home/Star_Chat.png';


/**
 * 文章列表单条内容组件
 */
function Index() {
  const { item } = this.props;

  const gotoDetail = (e) => {
    Taro.navigateTo({
      url: `/pages/articleDetail/index?id=${e.currentTarget.dataset.id}`,
    })
    // console.log(e.currentTarget.dataset.id);
  }
  return (
    <View className='articles-li' data-id={item.id} onClick={gotoDetail}>
      <View className="article-title">
        <View className="title-text">{item.title}</View>
        <View className="title-time">{item.created_at}</View>
      </View>
      <Image
        className='article-img'
        mode='widthFix'
        src={banner}
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

export default Index
