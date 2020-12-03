import Taro, { Component, useState } from '@tarojs/taro'
import BaseComponent from "../../../components/BaseComponent";
import { View, Image, ScrollView } from '@tarojs/components'
import { connect } from '@tarojs/redux';
import { ossUrl } from "../../../config";
import { AtAvatar } from 'taro-ui'
import './index.less'
import { CONS } from "../../../utils/constants";
import { getWindowHeight } from "../../../utils/style";

const img_msg = ossUrl + 'upload/images/user/news.png';
const img_atv = ossUrl + 'upload/images/user/avatar.png';
const img_more = ossUrl + 'upload/images/user/more.png';
const img_sex_male = ossUrl + 'upload/images/user/img_sex_male.png';
const img_sex_female = ossUrl + 'upload/images/user/img_sex_female.png';
@connect(({ user, common }) => ({
    ...user,
    ...common,
}))
export default class tabUser extends BaseComponent {
    config = {
        navigationBarTitleText: '我的',
    }


    constructor() {
        super(...arguments)
        this.state = {}
    }

    componentDidMount = () => {
        if (!this.props.access_token) {
            Taro.navigateTo({
                url: '/pages/login/index?callback=/pages/tabs/tabUser/index',
            })
            return;
        } else {
            //请求获取用户信息
            this.props.dispatch({
                type: 'user/get_personal_info',
            });
        }
    }

    componentDidShow = () => {
        this.log('User componentDidShow');
    }

    goPage = (e) => {
        if (e.currentTarget.dataset.url == '/pages/login/index' && this.props.access_token) {
            return;
        }
        Taro.navigateTo({
            url: e.currentTarget.dataset.url,
        })
    }

    goToPage = (e) => {
        if (!this.props.access_token) {
            Taro.navigateTo({
                url: '/pages/login/index',
            })
            return;
        }
        this.log('goToPage');
        this.log(e.currentTarget.dataset.url);
        Taro.navigateTo({
            url: e.currentTarget.dataset.url,
        })
    }


    //复制准了号
    actionCopyNum = (e) => {
        let id = e.currentTarget.dataset.id;
        if (copy(id)) {
            showToast('复制成功！');
        } else {
            showToast('复制失败！');
        }
        e.stopPropagation();
    }

    //消息按钮，被点击
    actionMsg = (e) => {
        this.log('actionMsg');
        Taro.navigateTo({ url: '/minePages/message/index' });
        e.stopPropagation();
    }

    //点击顶部内容
    actionUserHeaderClick = () => {
        this.log('actionUserHeaderClick');
        Taro.navigateTo({ url: '/minePages/mine/userCenter/index' });
    }

    //分享
    actionShareClick = () => {
        this.log('actionShareClick')
        jsSdkConfig();
    }

    render() {
        const {
            user,
            gridItems,
            astrologerItems,
        } = this.props;
        let asc = '';
        if (user) {
            asc = '日' + CONS[user.sun.split('-')[0] - 1].item + '月' + CONS[user.moon.split('-')[0] - 1].item + '升' + CONS[user.asc.split('-')[0] - 1].item;
        }
        return (
            <View className='user-page'>
                <ScrollView
                    className='scrollview'
                    scrollY
                    scrollWithAnimation
                    scrollTop='0'
                    style={'height: ' + getWindowHeight(false, true, 0) + 'px;'}
                    lowerThreshold='20'
                    onScrollToLower={this.onScrollToLower}
                >
                    <View className="user-header">
                        <View className="header-con" onClick={this.actionUserHeaderClick}>
                            <Image className='img-msg' src={img_msg} onClick={this.actionMsg}></Image>
                            <AtAvatar circle className="img-avatar" image={user.avatar != '' ? ossUrl + user.avatar : img_atv} ></AtAvatar>
                            <View className="right-con">
                                <View className="name">{user && user.name} </View>
                                <View className="num">ID号：{user && user.uen}</View>
                                <View className="asc">
                                    <View className="icon">
                                        <Image className="img-sex" src={user && user.sex == 1 ? img_sex_male : img_sex_female}></Image>
                                    </View>
                                    <View className="asc-text">{asc}</View>
                                </View>
                            </View>
                        </View>
                    </View>
                    {/* 菜单 */}
                    <View className="container">
                        <View className="tab">
                            {
                                gridItems && gridItems.map((item) => {
                                    return (
                                        <View className="tab-item" data-url={`${item.link}`} onClick={this.goToPage}>
                                            <Image className='img' mode='widthFix' src={item.img}></Image>
                                            <View className='text'>{item.txt}</View>
                                        </View>
                                    )

                                })
                            }
                        </View>
                        {/* 列表 */}
                        <View className="list">
                            {
                                astrologerItems && astrologerItems.map((item) => {
                                    return (
                                        <View className="list-item" data-url={`${item.link}`} onClick={this.goToPage}>
                                            <View className="item">
                                                <View className="left">
                                                    <Image className='icon-img' src={item.img}></Image>
                                                    <View className="text">{item.txt}</View>
                                                </View>
                                                <Image className="right" src={img_more}></Image>
                                            </View>
                                            <View className="line"></View>
                                        </View>
                                    )
                                })
                            }

                        </View>

                    </View>

                </ScrollView>
            </  View>)
    }
}