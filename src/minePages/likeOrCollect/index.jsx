import Taro, { Component } from '@tarojs/taro'
import BaseComponent from "../../components/BaseComponent";
import { View, Text } from '@tarojs/components'
import './index.less'
import { connect } from '@tarojs/redux';

//通用列表组件
import CommonList from '../../components/CommonList/CommonList';
import { AtNavBar, AtTabs } from "taro-ui";
import {
    ASTRO_TABS,
    LIST_ITEM_TYPES,
} from "../../utils/constants";
import { getWindowHeight } from "../../utils/style";

@connect(({ likeOrCollect, common }) => ({
    ...likeOrCollect, ...common
}))

export default class Index extends BaseComponent {

    componentDidMount() {
        let type = this.$router.params.type;

        //设置导航栏名字
        let nav_title = '';
        switch (Number(type)) {
            case LIST_ITEM_TYPES.ITEM_COLLECT: {
                nav_title = '我的收藏';

                break;
            }
            case LIST_ITEM_TYPES.ITEM_ZAN: {
                nav_title = '我的点赞';
                break;
            }

        }
        this.setState(
            {
                nav_title: nav_title,
            });
        this.props.dispatch({
            type: 'commonList/save',
            payload: {
                type: type
            }
        });
        this.requestFirstPage(type);

    }

    componentDidShow() { }

    //加载第一页内容
    requestFirstPage = (type) => {
        //保存type
        this.props.dispatch({
            type: 'likeOrCollect/save',
            payload: {
                type: type,
                list: [],
                page: 1,
            }
        });
        this.setState({ list: [] })

        //请求列表
        this.props.dispatch({
            type: 'likeOrCollect/lists'
        }).then((list) => {
            this.setState({ list })
        })

    }

    //列表加载更多被触发
    onListMore = () => {
        //如果loading状态为2，也就是没有更多了，那么就返回
        if (this.props.loading == 2) return;

        //如果还有更多，那么加载
        let page = this.props.page + 1;
        //保存数据
        this.props.dispatch({
            type: 'likeOrCollect/save',
            payload: {
                page: page,
                loading: 1,
            }
        });
        //请求列表
        this.props.dispatch({
            type: 'likeOrCollect/lists',
        }).then((list) => {
            this.setState({ list })
        })
    }

    //单个item点击事件
    onItemClick = (index, type) => {
        if (this.state.is_show_selected == 1) {//正在显示选中radio
            let list = this.props.list;
            this.log(list);
            if (list[index].is_selected && list[index].is_selected == 1) {
                list[index].is_selected = 0;
            } else {
                list[index].is_selected = 1;
            }
            //保存数据
            this.props.dispatch({
                type: 'likeOrCollect/save',
                payload: {
                    list: list,
                }
            });
            this.setState({ list })
            this.log(list);

            //判断是否有选中的内容
            let is_del_btn_enable = false;
            this.state.list.forEach((item) => {
                if (1 == item.is_selected) {
                    is_del_btn_enable = true;
                }
            })
            this.setState({ is_del_btn_enable })
        }

    }


    actionNavBack = () => {
        if (LIST_ITEM_TYPES.ITEM_ASTRO_NOTE == this.$router.params.type) {
            let index = ''
            for (let i = 0; i < ASTRO_TABS.length; i++) {
                let item = ASTRO_TABS[i]
                if (item.params == this.$router.params.from) {
                    index = i
                }
            }

            Taro.redirectTo({ url: '/pages/astro/detail/index?index=' + index })
        } else {
            Taro.navigateBack()
        }
    }


    config = {
        navigationBarTitleText: ''
    }

    render() {
        const {
            type,
            total,
            loading,
            empty_des,
            rids,
        } = this.props;
        const {
            nav_title,
            is_show_selected,
            list,
            is_select_all,
            is_del_btn_enable,

        } = this.state;

        return (
            <View className='page'>
                <AtNavBar
                    className='nav'
                    onClickLeftIcon={this.actionNavBack}
                    color='#000'
                    title={nav_title}
                    leftIconType='chevron-left'
                    fixed={false}
                />
                <View className='list'>
                    {/*文章收藏tab*/}
                    <CommonList
                        type={type}
                        height={getWindowHeight(false, true, 60)}
                        onListMore={this.onListMore}
                        loading={loading}
                        list={list}
                        is_show_selected={is_show_selected}
                        onItemClick={this.onItemClick}
                        empty_des={empty_des}
                        is_select_all={is_select_all}
                        is_del_btn_enable={is_del_btn_enable}
                        onDeleteAllBarClick={this.onDeleteAllBarClick}
                    />
                </View>
            </View>
        )
    }
}
