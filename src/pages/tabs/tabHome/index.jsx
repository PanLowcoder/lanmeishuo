import Taro, { useState, useEffect, createContext, useContext } from '@tarojs/taro'
import { View, Text, Image } from '@tarojs/components'
import * as homeApi from './service';
import { connect } from '@tarojs/redux';
import './index.less'
import MySwiper from '../../../components/Swiper/MySwiper';
import ArticleList from '../../../components/ArticleList';

import icon_Astrolable from '../../../images/home/Astrolabe.png';
import icon_Combine from '../../../images/home/Combine.png';
import icon_Correction from '../../../images/home/Correction.png';
import icon_Diary from '../../../images/home/Diary.png';
import icon_Prediction from '../../../images/home/Prediction.png';

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
            title: '星盘',
            url: icon_Correction
        },
        {
            title: '日记',
            url: icon_Diary
        },
        {
            title: '预测',
            url: icon_Prediction
        },
    ]
    const [data, setData] = useState(props.data)
    useEffect(() => {
        // this.props.dispatch({
        //     type: 'tabHome/load',
        // }).then((data) => {
        //     console.log(data);
        // })
    })

    return (
        <View className='home'>
            <MySwiper />
            <View className="container">
                {/* 导航栏 */}
                <View className='nav'>
                    {tabs.map((item) => {
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
                                    <View className="fina">财富78%</View>
                                    <View className="job">事业61%</View>
                                    <View className="love">桃花39%</View>
                                    <View className="text">xxxxxxxx</View>
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
                    </View>
                    {/*文章列表*/}
                    <DataContext.Provider value={data.article}>
                        <ArticleList />
                    </DataContext.Provider>

                    {/* {data.article.map((item) => {
                        return (
                            <View>{item.auth}--{item.id}</View>
                        )
                    })} */}
                </View>
            </View>
        </View>
    )

}
Index.config = {
    navigationBarTitleText: '首页'
}

const mapStateToProps = (state) => {
    return {
        data: state.tabHome.data
    }
}

export default connect(mapStateToProps)(Index) 
