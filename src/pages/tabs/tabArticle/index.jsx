import Taro from '@tarojs/taro';
import BaseComponent from "../../../components/BaseComponent";
import { View, Input } from '@tarojs/components';
import './index.less';
import { connect } from '@tarojs/redux';
import { AtTabs, AtTabsPane } from 'taro-ui';

import CommonList from '../../../components/CommonList/CommonList';
import { LIST_ITEM_TYPES } from "../../../utils/constants";
import { getWindowHeight } from "../../../utils/style";

@connect(({ tabArticle, common }) => ({
    ...tabArticle,
    ...common
}))
export default class tabArticle extends BaseComponent {
    config = {
        navigationBarTitleText: '星文'
    }

    componentDidMount = () => {
        if (!this.props.access_token) {
            Taro.navigateTo({
                url: '/pages/login/index?callback=/pages/tabs/tabArticle/index',
            })
            return;
        }
    };

    componentDidShow = () => {
        this.log('tabArticle componentDidShow');
        if (this.props.categories && this.props.categories.length > 0) {//当前所有文章分类数据不为空，已保存到本地
            this.log('当前所有文章分类数据不为空，已保存到本地');
            this.props.dispatch({
                type: 'tabArticle/save',
                payload: {
                    cid: this.props.categories[0].id,
                }
            });
            //请求文章列表
            this.props.dispatch({
                type: 'tabArticle/articles',
                payload: {
                    page: 1
                }
            });
        } else {
            //请求所有分类数据
            this.props.dispatch({
                type: 'tabArticle/categories',
            });
        }
    }

    //tab栏点击
    handleTabsClick(stateName, value) {
        this.setState({
            [stateName]: value
        })
        let cid = this.props.categories[value].id;

        this.props.dispatch({
            type: 'tabArticle/save',
            payload: {
                cid: cid,
                list: [],
                page: 1,
            },
        });

        //请求列表
        this.props.dispatch({
            type: 'tabArticle/articles',
            payload: {
                page: 1,
            }
        });

    }

    //列表加载更多被触发
    onListMore = () => {
        //如果loading状态为2，也就是没有更多了，那么就返回
        if (this.props.loading == 2) return;

        //如果还有更多，那么加载
        let page = this.props.page + 1;
        this.log('commonList onListMore current_page=' + page);
        //保存数据
        this.props.dispatch({
            type: 'tabArticle/save',
            payload: {
                page: page,
                loading: 1,
            }
        });
        //请求文章列表
        this.props.dispatch({
            type: 'tabArticle/articles',
        });
    }

    render() {
        const { list, loading, categories } = this.props;

        const { category_index } = this.state;
        if (categories) {
            for (let i = 0; i < categories.length; i++) {
                categories[i].title = categories[i].name;
            }
        }
        return (
            <View className='tab-article-page'>
                <View className="search">
                    <Input className='input' type='text' placeholder='9月1日双子座运势' placeholderStyle='color: rgba(49, 56, 54, 0.3)' />
                </View>
                <View className="line"></View>
                {/* Tabs */}
                <View className='content'>
                    {categories && categories.length > 0 && (
                        <AtTabs
                            className='tab'
                            swipeable={false}
                            animated={false}
                            scroll
                            current={category_index}
                            tabList={categories}
                            onClick={this.handleTabsClick.bind(this, 'category_index')}
                        >
                            {categories && categories.length > 0 && categories.map((item, index) => (
                                //单个item
                                <AtTabsPane className='tab_pane' current={category_index} index={index}>
                                    <CommonList
                                        className='list-con'
                                        height={getWindowHeight(true, true, 10)}
                                        onListMore={this.onListMore}
                                        loading={loading}
                                        list={list && list.length > 0 && list}
                                        type={LIST_ITEM_TYPES.ITEM_ARTICLE}
                                    />
                                </AtTabsPane>
                            ))}
                        </AtTabs>
                    )}
                </View>
            </View>
        )
    }
}
