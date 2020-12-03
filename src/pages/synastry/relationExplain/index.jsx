import Taro, { Component } from '@tarojs/taro'
import BaseComponent from "../../../components/BaseComponent";
import { View, Text } from '@tarojs/components'
import './index.less'
import { AtNavBar } from "taro-ui";
import { connect } from '@tarojs/redux';
import { get_synastry_explain_detail } from '../synastryDetail/service'


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
        console.log(this.props)
        this.requestDetail();
    };



    config = {
        navigationBarTitleText: '关系详解'
    }

    render() {
        const { data } = this.state;
        console.log(this.state)
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
                <Text>问答</Text>
            </View>
        )
    }
}
