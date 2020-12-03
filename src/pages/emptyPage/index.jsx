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
            <View className='empty-page'>
                <AtNavBar
                    className='nav'
                    onClickLeftIcon={this.actionNavBack}
                    color='#000'
                    title='待开发'
                    leftIconType='chevron-left'
                    fixed={false}
                />
                <Text>本功能正在开发中~</Text>
            </View>
        )
    }
}
