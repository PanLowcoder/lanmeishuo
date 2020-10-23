import Taro, { useEffect, useState, createContext } from '@tarojs/taro'
import { View, Text } from '@tarojs/components'
import { connect } from '@tarojs/redux';
import './index.less'
import { AtTabs, AtTabsPane } from 'taro-ui';
import ArticleList from '../../../components/ArticleList';

export const DataContext = createContext()

function Index(props) {
    const [current, setCurrent] = useState(0)
    const [data, setData] = useState(props.data)
    const [categories, setCategories] = useState(props.categories)

    if (categories) {
        for (let i = 0; i < categories.length; i++) {
            categories[i].title = categories[i].name;
        }
    }

    useEffect(() => {
        if (!props.access_token) {
            Taro.navigateTo({
                url: '/pages/login/index?callback=/pages/tabs/tabArticle/index',
            })
            return;
        }
        if (props.categories && props.categories.length > 0) {//当前所有文章分类数据不为空，已保存到本地
            props.dispatch({
                type: 'tabArticle/save',
                payload: {
                    cid: props.categories[0].id,
                }
            });
            //请求文章列表
            props.dispatch({
                type: 'tabArticle/articles',
                payload: {
                    page: 1
                }
            });
        } else {
            //请求所有分类数据
            props.dispatch({
                type: 'tabArticle/categories',
            });
        }
    }, [data])

    const handleClick = (value) => {
        setCurrent(value)
    }

    return (
        <View className='article'>
            <AtTabs animated={false} current={current} tabList={categories} onClick={handleClick}>
                <AtTabsPane current={current} index={0} >
                    <DataContext.Provider value={data.article}>
                        <ArticleList />
                    </DataContext.Provider>
                </AtTabsPane>
                <AtTabsPane current={current} index={1}>
                    <DataContext.Provider value={data.article}>
                        <ArticleList />
                    </DataContext.Provider>
                </AtTabsPane>
                <AtTabsPane current={current} index={2}>
                    <DataContext.Provider value={data.article}>
                        <ArticleList />
                    </DataContext.Provider>
                </AtTabsPane>
                <AtTabsPane current={current} index={3}>
                    <DataContext.Provider value={data.article}>
                        <ArticleList />
                    </DataContext.Provider>
                </AtTabsPane>
            </AtTabs>
        </View>
    )

}

Index.config = {
    navigationBarTitleText: '星文'
}

const mapStateToProps = (state) => {
    // console.log(state);
    return {
        categories: state.tabArticle.categories,
        data: state.tabHome.data
    }
}

export default connect(mapStateToProps)(Index) 
