import Taro, { Component, useState } from '@tarojs/taro'
import { View, Text, Image } from '@tarojs/components'
import { connect } from '@tarojs/redux';

import { AtAvatar } from 'taro-ui'
import './index.less'

function Index(props) {
    const [gridItems, setGridItems] = useState(props.gridItems)
    return (
        <View className='user'>
            <View className="user-header">
                <View className="header-con">
                    <View className="img-avatar">
                        <AtAvatar circle size='large' ></AtAvatar>
                    </View>
                    <View className="right-con">
                        <View className="name">南山吴彦祖 </View>
                        <View className="num">ID: 59120301031</View>
                        <View className="asc">
                            <View className="icon">
                                <Image className="img-sex"></Image>
                            </View>
                            <View className="asc-text">日金牛·月射手·升天秤</View>
                        </View>
                    </View>
                </View>
            </View>
            <View className="container">
                <View className="tab">
                    {
                        gridItems && gridItems.map((item) => {
                            return (
                                <View className="tab-item">
                                    <Image className='img' mode='widthFix' src={item.img}></Image>
                                    <View className='text'>{item.txt}</View>
                                </View>
                            )

                        })
                    }

                </View>


                <View className="list">
                    <View className="list-item">2</View>
                    <View className="list-item">2</View>
                    <View className="list-item">2</View>

                </View>

            </View>
        </View>
    )
}

const mapStateToProps = (state) => {
    console.log(state);
    return {
        gridItems: state.user.gridItems
    }
}

export default connect(mapStateToProps)(Index) 
