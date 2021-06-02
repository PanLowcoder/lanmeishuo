import Taro from '@tarojs/taro';
import BaseComponent from '../../../components/BaseComponent';
import { View, Image } from '@tarojs/components';
import { AtNavBar, AtButton, AtAvatar } from 'taro-ui';
import { connect } from '@tarojs/redux';
import {
    getAscFromRecord,
    getNameFromRecord,
    getImgFromRecord,
    getSelfRecord,
    getSubString,
    goToCommonPage,
} from '../../../utils/common';
import { ossUrl } from '../../../config';
import { PAGES } from '../../../utils/constants';
import { RECORD_SELECT_TYPES } from '../../record/recordSelect/constants';
import './index.less'

const default_atavar = ossUrl + 'upload/images/recode/male.png';
const del_icon = ossUrl + 'upload/images/recode/del.png';
const img_more = ossUrl + 'upload/images/user/more.png';
const left_arrow = ossUrl + 'upload/images/article/left_arrow.png';
const img_sex_male = ossUrl + 'upload/images/user/img_sex_male.png';
const img_sex_female = ossUrl + 'upload/images/user/img_sex_female.png';

@connect(({ synastryDetail, common }) => ({
    ...synastryDetail,
    ...common
}))
export default class Index extends BaseComponent {

    constructor() {
        super(...arguments)
        this.state = {
            current_record_index: 0,
            record1: '',
            record2: '',

            list: [],//合盘历史列表（保存在本地）
        }
    }

    componentWillMount() {
        this.setState({ record1: getSelfRecord() });
    }

    componentDidMount() { }

    componentDidShow() {
        //单选档案
        if (this.props.selected_records.length == 1) {
            if (this.state.current_record_index == 0) {
                this.setState({ record1: this.props.selected_records[0] });
            } else {
                this.setState({ record2: this.props.selected_records[0] });
            }

            //保存当前选择的档案
            this.props.dispatch({
                type: 'common/save',
                payload: {
                    selected_records: this.props.selected_records,
                }
            });
        }

        //合盘历史
        let list = Taro.getStorageSync('store_synatry_list');
        this.setState({ list: list });

    }


    config = {
        navigationBarTitleText: '合盘'
    }

    // 修改资料
    actionRecordClick = (e) => {
        let index = e.currentTarget.dataset.index;
        this.setState({ current_record_index: index });
        goToCommonPage(PAGES.PAGE_RECORD_SELECT, '?type=' + RECORD_SELECT_TYPES.SELECT_ONE);
    }

    //合盘按钮 被点击
    actionDetail = () => {
        // Taro.navigateTo({ url: '/pages/synastry/synastryDetail/index' });
        if (this.state.record1 && this.state.record2) {
            Taro.navigateTo({ url: '/pages/synastry/synastryDetail/index?rid1=' + this.state.record1.id + '&rid2=' + this.state.record2.id });
        } else {
            Taro.showToast({
                title: `请选择合盘档案`,
                icon: 'none',
                mask: true,
            });
        }
    }
    // 清空缓存
    actionRemoveStorage = () => {
        Taro.showModal({
            title: '提示',
            content: '确认要清空合盘记录吗?',
            confirmColor: '#6C5FD3',
            success: function (res) {
                if (res.confirm) {
                    Taro.removeStorageSync('store_synatry_list');
                    Taro.reLaunch({
                        url: '/pages/synastry/synastryList/index'
                    })
                } else if (res.cancel) {

                }
            }
        })
    }

    //历史记录 被点击
    actionListItemClick = (e) => {
        this.log('actionListItemClick');
        Taro.navigateTo({ url: '/pages/synastry/synastryDetail/index?rid1=' + e.currentTarget.dataset.rid1 + '&rid2=' + e.currentTarget.dataset.rid2 });
    }

    render() {
        const { record1, record2, list } = this.state;
        return (
            <View className='synastry-page'>
                {/*顶部*/}
                <View className='header'>
                    {/*返回按钮*/}
                    <View className='backNavBar' onClick={this.actionNavBack}>
                        <Image className='left_arrow' src={left_arrow}></Image>
                    </View>
                    <View className='title'>
                        关系合盘
                    </View>
                </View>
                <View className="top-con">
                    <View className="left">
                        <View className="left-con">
                            <View className="user" data-index={0} onClick={this.actionRecordClick}>
                                <View className='img'>
                                    <Image className='img-record' mode='aspectFit' src={getImgFromRecord(record1, default_atavar, false)}></Image>
                                </View>
                                <View className='change'>{getAscFromRecord(record1) == '' ? '选择合盘档案' : '更换身份'}</View>
                                {record1.type === 1 || record1.type === 2 ? <View className='show_sex'>
                                    <Image className='img_sex' src={record1.type && record1.type === 1 ? img_sex_male : img_sex_female}></Image>
                                </View> : <View></View>}
                            </View>
                            <View className="info">
                                <View className="name">{getNameFromRecord(record1)}</View>
                                {getAscFromRecord(record1) == '' ? <View className="con_no"></View> : <View className="con"> {getAscFromRecord(record1)}</View>}
                            </View>
                            <View className="astro">
                                <Image className='img-record' mode='aspectFit' src={getImgFromRecord(record1, default_atavar, true)}></Image>
                            </View>
                        </View>
                    </View>
                    <View className="right">
                        <View className="right-con">
                            <View className="astro">
                                <Image className='img-record' mode='aspectFit' src={getImgFromRecord(record2, default_atavar, true)}></Image>
                            </View>
                            <View className="info">
                                <View className="name">{getNameFromRecord(record2)}</View>
                                {getAscFromRecord(record2) == '' ? <View className="con_no"></View> : <View className="con"> {getAscFromRecord(record2)}</View>}
                            </View>
                            <View className="user" data-index={1} onClick={this.actionRecordClick}>
                                <View className='img'>
                                    <Image className='img-record' mode='aspectFit' src={getImgFromRecord(record2, default_atavar, false)}></Image>
                                </View>
                                <View className='change'>{getAscFromRecord(record2) == '' ? '选择合盘档案' : '更换身份'}</View>
                                {record2.type === 1 || record2.type === 2 ? <View className='show_sex'>
                                    <Image className='img_sex' src={record2.type && record2.type === 1 ? img_sex_male : img_sex_female}></Image>
                                </View> : <View></View>}
                            </View>
                        </View>
                    </View>
                    <AtButton className="btn" onClick={this.actionDetail}>合盘</AtButton>
                </View>
                <View className="record">
                    <View className="head">
                        <View className="title">合盘记录</View>
                        <View className="del" onClick={this.actionRemoveStorage}>
                            <Image className='icon' src={del_icon}></Image>
                            <View className="text">清空</View>
                        </View>
                    </View>
                    {/* 合盘记录 */}

                    {(!list || list.length == 0) ? (
                        <View className='empty'>暂时没有合盘记录~</View>
                    ) : (
                        <View className="list">
                            {list && list.length > 0 && list.map((item, index) => {
                                return (
                                    <View className="item" data-rid1={item.rid1} data-rid2={item.rid2} onClick={this.actionListItemClick}>
                                        <View className="content">
                                            <View className="name">{getSubString(item.name1, 12)} & {getSubString(item.name2, 12)}</View>
                                            <View className="time">2020.09.09  5:03:53</View>
                                        </View>
                                        <Image className="more" src={img_more}></Image>
                                    </View>
                                )
                            })
                            }
                        </View>
                    )}
                </View>
            </View>
        )
    }
}
