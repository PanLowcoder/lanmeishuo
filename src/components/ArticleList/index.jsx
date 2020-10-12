import Taro, { createContext, useContext } from '@tarojs/taro';
import BaseComponent from "../BaseComponent";
import { View } from '@tarojs/components';
import PropTypes from 'prop-types';
import './index.less';

import ItemArticle from '../Item/ItemArticle';
import { DataContext } from '../../pages/tabs/tabHome';

/**
 * 文章列表（首页需要用到）
 */
function Index() {
  const list = useContext(DataContext)
  return (
    <View className='article-list-container'>
      <View className="articles-ul">
        {
          list.map((item) => {
            return (
              <ItemArticle
                key={item.id}
                item={item}
              />

            )

          })
        }
      </View>

    </View>
  )

}

export default Index;
