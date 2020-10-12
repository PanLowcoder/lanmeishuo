import Taro from '@tarojs/taro';
import { View, Text, Image, Icon } from '@tarojs/components';
import PropTypes from 'prop-types';
import { AtAvatar } from 'taro-ui'

import './index.less';
import { List } from '../../ArticleList';

import banner from '../../../images/home/banner.jpg';
import watch from '../../../images/home/Star_Chat.png';
import star from '../../../images/home/Star_Star.png';


/**
 * 文章列表单条内容组件
 */
function Index() {
  const { item } = this.props;
  // const item = this.props;
  return (
    <View className='articles-li'>
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
          <AtAvatar circle size='small'></AtAvatar>
          <View className='author'>{item.id}</View>
        </View>

        <View className='right-con'>
          {/*阅读数*/}
          <View className=''>
            <Image
              className='right-img'
              src={watch}
            />
            <Text className=''>{item.watch}</Text>
          </View>
          {/*评论数*/}
          <View className=''>
            <Image
              className='right-img'
              src={star}
            />
            <Text className=''>{item.watch}</Text>
          </View>
        </View>
      </View>
    </View>
  )

}

export default Index
