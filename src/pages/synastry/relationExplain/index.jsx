import Taro, { Component } from '@tarojs/taro'
import BaseComponent from "../../../components/BaseComponent";
import { View, Image, ScrollView } from '@tarojs/components'
import './index.less'
import { AtNavBar } from "taro-ui";
import { connect } from '@tarojs/redux';
import { get_synastry_explain_detail } from '../synastryDetail/service'
import { PLANET, PHASE } from '../../../utils/constants'
import { getWindowHeight } from "../../../utils/style";
import { ossUrl } from "../../../config";

const icon_point_love = ossUrl + 'wap/images/synastry/icon_point_love.png'
const icon_point_good = ossUrl + 'wap/images/synastry/icon_point_good.png'
const icon_point_bad = ossUrl + 'wap/images/synastry/icon_point_bad.png'
const icon_point_neutral = ossUrl + 'wap/images/synastry/icon_point_neutral.png'
const icon_relation_bad = ossUrl + 'wap/images/synastry/icon_relation_bad.png'
const icon_relation_good = ossUrl + 'wap/images/synastry/icon_relation_good.png'
const icon_relation_love = ossUrl + 'wap/images/synastry/icon_relation_love.png'
const icon_relation_neutral = ossUrl + 'wap/images/synastry/icon_relation_neutral.png'

@connect(({ synastryDetail }) => ({
    ...synastryDetail,
}))
export default class Index extends BaseComponent {
    constructor() {
        super(...arguments)
        this.state = {
            data: ''
        }
    }

    async requestDetail() {
        const res = await get_synastry_explain_detail({
            id1: this.props.rid1,
            id2: this.props.rid2,
            chart: 'synastry'
        });
        if (res.code == '200') {
            this.setState({ data: res.data.a_vs_b });
        }
    }

    componentDidMount = () => {
        this.requestDetail();
    };

    config = {
        navigationBarTitleText: '关系详解'
    }

    getGoodText(value) {
        switch (Number(value)) {
            case -1:
                return '不利';
            case 0:
                return '中性';
            case 1:
                return '有利';
        }
    }

    getRelationIcon(good, love) {
        if (love == 1) {
            return icon_relation_love;
        } else if (good == -1) {
            return icon_relation_bad;
        } else if (good == 0) {
            return icon_relation_neutral;
        } else {
            return icon_relation_good;
        }
    }

    getGoodPointIcon(good) {
        if (good == -1) {
            return icon_point_bad;
        } else if (good == 0) {
            return icon_point_neutral;
        } else {
            return icon_point_good;
        }
    }


    render() {
        const { data } = this.state;
        console.log(data)

        return (
            <View className='relation-explain-page'>
                {/*导航栏*/}
                <AtNavBar
                    className='nav'
                    onClickLeftIcon={this.actionNavBack}
                    color='#000'
                    title='关系详解'
                    border={false}
                    leftIconType='chevron-left'
                    fixed
                />
                <ScrollView
                    className='scrollview'
                    scrollY
                    scrollWithAnimation
                    scrollTop='0'
                    style={'height: ' + getWindowHeight(false, true, 0) + 'px;'}
                    lowerThreshold='20'
                >
                    {data && data.length > 0 && data.map((item) => (

                        <View className='item-con'>
                            {/*上部分*/}
                            <View className='top-con'>
                                <View className='left-con'>
                                    {/*标题 */}
                                    <View className='title'>{PLANET(item.id1).whole}{PHASE(item.phase).whole}{PLANET(item.id2).whole} </View>
                                    {/*底部有利和桃花部分*/}
                                    <View className='bottom-con'>
                                        <View className='good padding'>{this.getGoodText(item.good)}</View>

                                        {item.love == 1 && (
                                            <View className='love padding margin-left'>桃花</View>
                                        )}

                                    </View>
                                </View>

                                {/*右侧图片*/}
                                <View className='right-con'>
                                    11111
                                </View>
                            </View>
                            <View className='des'>{item.text}</View>
                        </View>

                    ))}
                </ScrollView>
            </View>
        )
    }
}
