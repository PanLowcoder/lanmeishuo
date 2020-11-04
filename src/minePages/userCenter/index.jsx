import Taro, { Component } from '@tarojs/taro'
import { View, Text, Image } from '@tarojs/components'
import './index.less'
import { AtNavBar } from "taro-ui";
import { ossUrl } from "../../config";

const icon_more = ossUrl + 'upload/images/user/more.png';

function Index() {
    const userList = [
        {
            name: '头像',
        },
        {
            name: '昵称',
        },
        {
            name: '性别',
        },
    ];
    const recordList = [
        {
            name: '档案信息',
        },
        {
            name: '出生地址',
        },
        {
            name: '手机号码',
        },
        {
            name: '微信',
        },
    ]
    return (
        <View className='userCenter'>
            {/*导航栏*/}
            <AtNavBar
                className='nav'
                // onClickLeftIcon={actionNavBack}
                color='#000'
                border={false}
                title='个人中心'
                leftIconType='chevron-left'
                fixed
            />
            <View className="list-con">
                <View className="user">
                    {
                        userList && userList.map((item) => {
                            return (
                                <View className="item">
                                    <View className="top">
                                        <View className="label">{item.name}</View>
                                        <View className="info">
                                            <View className="content">吴彦祖</View>
                                            <Image className="icon" src={icon_more}></Image>
                                        </View>
                                    </View>
                                    <View className="foot"></View>
                                </View>
                            )
                        })
                    }
                </View>
                <View className="record">
                    {
                        recordList && recordList.map((item) => {
                            return (
                                <View className="item">
                                    <View className="top">
                                        <View className="label">{item.name}</View>
                                        <View className="info">
                                            <View className="content">吴彦祖</View>
                                            <Image className="icon" src={icon_more}></Image>
                                        </View>
                                    </View>
                                    <View className="foot"></View>
                                </View>
                            )
                        })
                    }
                </View>

            </View>
        </View>
    )

}

Index.config = {
    navigationBarTitleText: '个人中心'
}

export default Index
