import Taro, { Component } from '@tarojs/taro'
import { View, Text } from '@tarojs/components'
import './index.less'

function Index() {
    // const
    return (
        <View className='question'>
            <Text>问答</Text>
        </View>
    )

}

Index.config = {
    navigationBarTitleText: '问答'
}

export default Index
