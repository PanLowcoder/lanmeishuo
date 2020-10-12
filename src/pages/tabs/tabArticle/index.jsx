import Taro, { useEffect, useState } from '@tarojs/taro'
import { View, Text } from '@tarojs/components'
import { connect } from '@tarojs/redux';

import './index.less'

import { AtTabs, AtTabsPane } from 'taro-ui';

function Index(props) {
    const tabList = [{ title: '看点推荐' }, { title: '生命灵数' }, { title: '运迹天象' }, { title: '星座年运' }]

    const [current, setCurrent] = useState(0)

    useEffect(() => {

    })

    const handleClick = (value) => {
        setCurrent(value)
    }

    return (
        <View className='article'>
            <AtTabs animated={false} current={current} tabList={tabList} onClick={handleClick}>
                <AtTabsPane current={current} index={0} >
                    <View style='padding: 100px 50px;background-color: #FAFBFC;text-align: center;' >标签页一的内容</View>
                </AtTabsPane>
                <AtTabsPane current={current} index={1}>
                    <View style='padding: 100px 50px;background-color: #FAFBFC;text-align: center;'>标签页二的内容</View>
                </AtTabsPane>
                <AtTabsPane current={current} index={2}>
                    <View style='padding: 100px 50px;background-color: #FAFBFC;text-align: center;'>标签页三的内容</View>
                </AtTabsPane>
                <AtTabsPane current={current} index={3}>
                    <View style='padding: 100px 50px;background-color: #FAFBFC;text-align: center;'>标签页四的内容</View>
                </AtTabsPane>
            </AtTabs>
        </View>
    )

}

Index.config = {
    navigationBarTitleText: '星文'
}

const mapStateToProps = (state) => {
    // console.log(state);
    return {
        categories: state.tabArticle.categories,
    }
}

export default connect(mapStateToProps)(Index) 
