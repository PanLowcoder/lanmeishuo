import Taro, { Component } from '@tarojs/taro'
import BaseComponent from "../../components/BaseComponent";
import { View, Text } from '@tarojs/components'
import './index.less'
import { AtNavBar } from "taro-ui";

export default class Index extends BaseComponent {

    componentWillMount() { }

    componentDidMount() { }

    componentWillUnmount() { }

    componentDidShow() { }

    componentDidHide() { }

    config = {
        navigationBarTitleText: ''
    }

    render() {
        return (
            <View className='index'>
                <AtNavBar
                    className='nav'
                    onClickLeftIcon={this.actionNavBack}
                    color='#000'
                    title='设置'
                    leftIconType='chevron-left'
                    fixed={false}
                />
                <Text>设置</Text>
            </View>
        )
    }
}
