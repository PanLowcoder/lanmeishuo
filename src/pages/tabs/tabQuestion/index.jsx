import Taro, { Component } from '@tarojs/taro'
import BaseComponent from "../../../components/BaseComponent";
import { View, Text } from '@tarojs/components'
import './index.less'

export default class Index extends BaseComponent {

    componentWillMount() { }

    componentDidMount() { }

    componentWillUnmount() { }

    componentDidShow() { }

    componentDidHide() { }

    config = {
        navigationBarTitleText: '问答'
    }

    render() {
        return (
            <View className='index'>
                <Text>问答</Text>
            </View>
        )
    }
}
