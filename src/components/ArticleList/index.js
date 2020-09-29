import Taro from '@tarojs/taro';
import BaseComponent from "../BaseComponent";
import { View } from '@tarojs/components';
import PropTypes from 'prop-types';
import './index.less';

import ItemArticle from '../Item/ItemArticle';


/**
 * 文章列表（首页需要用到）
 */
function Index() {
  return (
    <View className='article-list-container'>
      <View className="articles-ul">
        <ItemArticle></ItemArticle>
        <ItemArticle></ItemArticle>
      </View>

    </View>
  )

}

export default Index;
