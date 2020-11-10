import Taro from '@tarojs/taro';
import BaseComponent from "../../BaseComponent";
import { View, ScrollView } from '@tarojs/components';
import PropTypes from 'prop-types';
import './index.less';

// 网络错误组件
import CommonErrorOrEmptyHint from '../../../components/CommonErrorOrEmptyHint';
import CommonDeleteAllBar from '../../../components/CommonList/CommonDeleteAllBar'
import { LIST_ITEM_TYPES } from "../../../utils/constants";

import ItemList from "../../Item/ItemList";
// import LoveHeader from "../../LoveHeader";

/**
 * 通用的列表组件（自动加载）
 */
class CommonList extends BaseComponent {
    static propTypes = {
        type: PropTypes.number,//0：我的幸运星列表；
        total: PropTypes.number,//列表的总数
        list: PropTypes.array,//列表数据
        onListMore: PropTypes.func,//滑动到底部事件
        height: PropTypes.number,//列表的高度
        loading: PropTypes.number,//0：不显示加载中；1：显示加载中；2：显示没有更多了；

        empty_des: PropTypes.string,//有数据说明数据为空；无数据说明数据不为空；

        is_show_selected: PropTypes.number,//是否显示选中框，0：不显示；1：显示；
        onItemClick: PropTypes.func,//选中按钮被点击
        onItemMoreClick: PropTypes.func,//更多按钮被点击

        record: PropTypes.object,//鉴爱选择的档案

        is_select_all: PropTypes.bool,//全选按钮是否选中
        is_del_btn_enable: PropTypes.bool,//删除按钮是否可用
        onDeleteAllBarClick: PropTypes.func,//删除或者全选事件

        onLoveRecordClick: PropTypes.func,//鉴爱选择档案回调方法
    }

    static defaultProps = {
        type: LIST_ITEM_TYPES.ITEM_LUCKY,
        list: [],
        loading: 0,
        height: 500,
        empty_des: '',
        total: -1,
        is_show_selected: 0,
    };


    constructor() {
        super(...arguments)
        this.state = {}
    }

    //滑动到底部
    onScrollToLower = () => {
        this.log('onScrollToLower');
        //加载下一页内容
        this.props.onListMore();
    }


    onItemClick = (index, type) => {
        this.log('CommonList onItemClick index=' + index + ',type=' + type);
        this.props.onItemClick(index, type);
    }


    //鉴爱选择的档案 index
    onClickStarLove = (index) => {
        this.log('onClickStarLove index=' + index);
        this.props.onLoveRecordClick(index);
    }

    onDeleteAllBarClick = () => {
        this.log('onDeleteAllBarClick')

    }

    render() {
        const {
            type,
            total,
            list,
            loading,
            height,
            empty_des,
            is_show_selected,
            onItemClick,
            onItemMoreClick,
            record,
            is_select_all,
            is_del_btn_enable,
            love_record_index,
        } = this.props;
        console.log('CommonList render height=' + height + ',list length=' + list.length + ',total=' + total + ',empty_des=' + empty_des + ',love_record_index=' + love_record_index);
        return (
            //当为我的收藏或者我的订单的时候，padding-top 需要增加
            <View
                className={(LIST_ITEM_TYPES.ITEM_ORDER == type || LIST_ITEM_TYPES.ITEM_COLLECT == type) ? 'common-list-con common-list-con-add' : 'common-list-con'}
            >
                {
                    (list && list.length > 0) || type == LIST_ITEM_TYPES.ITEM_IDENTIFY_LOVE ? (
                        //有数据
                        <ScrollView
                            className={type == LIST_ITEM_TYPES.ITEM_COLLECT_ARTICLE ? 'collect-article-scroll-view' : (type == LIST_ITEM_TYPES.ITEM_COLLECT_MAP ? 'map_scroll_view' : 'scrollview-in-common-list')}
                            scrollY
                            scrollWithAnimation
                            scrollTop='0'
                            style={'height: ' + height + 'px;'}
                            lowerThreshold='20'
                            onScrollToLower={this.onScrollToLower}
                        >
                            <View className='articles-ul'>
                                {list && list.length > 0 && list.map((item, index) => (
                                    <ItemList
                                        type={type}
                                        item={item}
                                        index={index}
                                        is_show_selected={is_show_selected}
                                        is_selected={Number(item.is_selected)}
                                        onItemClick={onItemClick}
                                        onItemMoreClick={onItemMoreClick}
                                    />
                                ))}
                            </View>
                            {loading == 1 && (
                                <View className='loadMoreGif'>
                                    <View className='zan-loading'></View>
                                    <View className='text'>加载中...</View>
                                </View>
                            )}
                            {loading == 2 && (
                                <View className='loadMoreGif'>
                                    {/*<View className='zan-loading'></View>*/}
                                    <View className='text'>没有更多了</View>
                                </View>
                            )}

                        </ScrollView>
                    ) : (
                            //无数据
                            <View>
                                {(empty_des && empty_des.length > 0 && (total == -1 || total == 0)) && (
                                    <CommonErrorOrEmptyHint
                                        des={empty_des}
                                    />
                                )}
                            </View>
                        )
                }
                {/*底部全选+删除bar*/}
                {is_show_selected == 1 && LIST_ITEM_TYPES.ITEM_ASTROLOGER != type && (
                    <CommonDeleteAllBar
                        is_select_all={is_select_all}
                        is_del_btn_enable={is_del_btn_enable}
                        onDeleteAllBarClick={this.props.onDeleteAllBarClick}
                    />
                )}
            </View>
        );
    }
}

export default CommonList;

