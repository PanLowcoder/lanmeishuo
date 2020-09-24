import Taro from '@tarojs/taro';
import BaseComponent from "../BaseComponent";
import { View } from '@tarojs/components';
import PropTypes from 'prop-types';
import './index.less';

import ItemArticle from '../Item/ItemArticle';


/**
 * 文章列表（首页需要用到）
 */
class ArticleList extends BaseComponent {
  static propTypes = {
    list: PropTypes.array,
  }

  static defaultProps = {
    list: [],
  };

  gotoDetail = (e) => {
    Taro.navigateTo({
      url: `/pages/articleDetail/index?id=${e.currentTarget.dataset.id}`,
    })
  }

  render() {
    const { list } = this.props;
    return (
      <View className='article-list-container'>
        {
          list.length > 0 ? (
            <View className='articles-ul'>
              {
                list.map((item) => (
                  <ItemArticle
                    item={item}
                  />
                ))
              }
            </View>
          ) : (
              <View></View>
            )
        }
      </View>
    );
  }
}

export default ArticleList;
