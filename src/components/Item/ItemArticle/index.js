import Taro from '@tarojs/taro';
import { View, Text, Image, Icon } from '@tarojs/components';
import PropTypes from 'prop-types';
import { ossUrl } from "../../../config";
import './index.less';

import banner from '../../../images/home/banner.jpg';
import heart from '../../../images/home/Star_Heart.png';
import chat from '../../../images/home/Star_Chat.png';
import star from '../../../images/home/Star_Star.png';


/**
 * 文章列表单条内容组件
 */
function Index() {
  return (
    <View className='articles-li'>
      <View className="article-title">
        <View className="title-text">九月运势</View>
        <View className="title-time">5小时前</View>
      </View>
      <Image
        className='article-img'
        mode='widthFix'
        src={banner}
        style="width:100%"
      />
      <View className="article-footer">
        <View className='left-con'>
          <Image
            className='left-img'
            src=''
          />
          <View className='author'>蓝莓说官方</View>
        </View>

        <View className='right-con'>
          {/*点赞数*/}
          <View className=''>
            <Image
              className='right-img'
              src={heart}
            />
            <Text className=''>12</Text>
          </View>
          {/*收藏数*/}
          <View className=''>
            <Image
              className='right-img'
              src={chat}
            />
            <Text className=''>11</Text>
          </View>
          {/*评论数*/}
          <View className=''>
            <Image
              className='right-img'
              src={star}
            />
            <Text className=''>11</Text>
          </View>
        </View>
      </View>
    </View>
  )

}

export default Index
