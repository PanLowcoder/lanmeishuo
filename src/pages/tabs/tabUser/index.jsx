import Taro, { Component, useState } from '@tarojs/taro'
import { View, Text, Image } from '@tarojs/components'
import { connect } from '@tarojs/redux';

import { AtAvatar } from 'taro-ui'
import './index.less'

import img_msg from '../../../images/user/news.png';
import img_atv from '../../../images/user/avatar.png';
import img_more from '../../../images/user/more.png';


function Index(props) {
    const [gridItems, setGridItems] = useState(props.gridItems)
    const [astrologerItems, setAstrologerItems] = useState(props.astrologerItems)

    const actionUserHeaderClick = () => {
        Taro.navigateTo({ url: '/minePages/mine/userCenter/index' });
    }

    const goToPage = (e) => {
        if (!this.props.access_token) {
            Taro.navigateTo({
                url: '/pages/login/index',
            })
            return;
        }
        console.log(e.currentTarget.dataset.url);
        Taro.navigateTo({
            url: e.currentTarget.dataset.url,
        })
    }
    return (
        <View className='user'>
            <View className="user-header">
                <View className="header-con" onClick={actionUserHeaderClick}>
                    {/* <Image className='img-msg' src={img_msg}></Image> */}
                    <AtAvatar circle className="img-avatar" image={img_atv} ></AtAvatar>
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
            {/* 菜单 */}
            <View className="container">
                <View className="tab">
                    {
                        gridItems && gridItems.map((item) => {
                            return (
                                <View className="tab-item" data-url={`${item.link}`} onClick={goToPage}>
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
                                <View className="list-item" data-url={`${item.link}`} onClick={goToPage}>
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
        </View>
    )
}

const mapStateToProps = (state) => {
    return {
        gridItems: state.user.gridItems,
        astrologerItems: state.user.astrologerItems
    }
}

export default connect(mapStateToProps)(Index) 
