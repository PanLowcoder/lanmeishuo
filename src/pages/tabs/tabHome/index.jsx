import Taro, { useState, useEffect, createContext, useContext } from '@tarojs/taro'
import { View, Text, Image } from '@tarojs/components'
import { connect } from '@tarojs/redux';
import { AtProgress } from 'taro-ui'
import './index.less'
import MySwiper from '../../../components/Swiper/MySwiper';
import ArticleList from '../../../components/ArticleList';

import icon_Astrolable from '../../../images/home/astrolabe.png';
import icon_Combine from '../../../images/home/combine.png';
import icon_Correction from '../../../images/home/correction.png';
import icon_Diary from '../../../images/home/diary.png';
import icon_Prediction from '../../../images/home/prediction.png';

import yellow from '../../../images/home/yellow.png';
import gray from '../../../images/home/gray.png';

import img_Today from '../../../images/home/today_bg.png';

export const DataContext = createContext()

function Index(props) {
    const tabs = [
        {
            title: '星盘',
            url: icon_Astrolable
        },
        {
            title: '合盘',
            url: icon_Combine
        },
        {
            title: '预测',
            url: icon_Prediction
        },
        {
            title: '日记',
            url: icon_Diary
        },

        {
            title: '生时校正',
            url: icon_Correction
        }
    ]
    const [data, setData] = useState(props.data)
    useEffect(() => {
        this.props.dispatch({
            type: 'tabHome/load',
        }).then((data) => {
            // console.log(data);
        })
    }, [])

    return (
        <View className='home'>
            <MySwiper />
            <View className="container">
                {/* 导航栏 */}
                <View className='nav'>
                    {tabs && tabs.map((item) => {
                        return (
                            <View className='nav-item'>
                                <Image
                                    className='img'
                                    src={item.url}
                                />
                                <View className='text'>{item.title}</View>
                            </View>
                        )
                    })}
                </View>
                {/* 内容部分 */}
                <View className="content">
                    {/* 运势 */}
                    <View className="fortune">
                        <View className="fortune-header">
                            <View className="header-left">
                                <View className="left-text">今日运势</View>
                                <View className="left-img">
                                    <Image className="img" src={yellow}></Image>
                                    <Image className="img" src={yellow}></Image>
                                    <Image className="img" src={gray}></Image>
                                </View>
                            </View>
                            <View className="header-right">周运</View>
                        </View>
                        <View className="fortune-content">
                            <View className="chart"></View>
                            <View className="des">
                                <View className="des-title">上午好!今天财运满满哦!</View>
                                <View className="des-content">
                                    <View className="item">
                                        <Text className="text">财富78%</Text>
                                        <View className="progress">
                                            <AtProgress percent={78} color='#FFA256' isHidePercent={true}></AtProgress>
                                        </View>
                                    </View>
                                    <View className="item">
                                        <Text className="text">事业61%</Text>
                                        <View className="progress">
                                            <AtProgress percent={61} color='#FED370' isHidePercent={true}></AtProgress>
                                        </View>
                                    </View>
                                    <View className="item">
                                        <Text className="text">桃花39%</Text>
                                        <View className="progress">
                                            <AtProgress percent={39} color='#FFE4A5' isHidePercent={true}></AtProgress>
                                        </View>
                                    </View>
                                    <View className="textarea">今日适合执行建身计划，比以往事半功倍，但是一定要注意</View>
                                </View>
                            </View>
                        </View>
                    </View>
                    {/* 今日天象 */}
                    <View className="today">
                        <Image
                            className='img'
                            mode="widthFix"
                            src={img_Today}
                        />
                        <View className="info">
                            <View className="date">2020.08.29 星期六</View>
                            <View className="today-content">
                                太阳在处女座，木星逆行，木星停滞土星逆行，土星停滞，大信封。
                            </View>
                        </View>
                    </View>
                    {/*文章列表*/}
                    <View className="art-title">
                        <View className="left">
                            <View className="text">星文推荐</View>
                        </View>
                        <View className="right">
                            <View className="more">查看更多</View>
                        </View>
                    </View>
                    <DataContext.Provider value={data.article}>
                        <ArticleList />
                    </DataContext.Provider>

                </View>
            </View>
        </View>
    )

}
Index.config = {
    navigationBarTitleText: '首页'
}

const mapStateToProps = (state) => {
    // console.log(state);
    return {
        data: state.tabHome.data
    }
}

export default connect(mapStateToProps)(Index) 
