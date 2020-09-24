import Taro, { useState, useEffect } from '@tarojs/taro'
import { View, Text, Image } from '@tarojs/components'
import * as homeApi from './service';
// import { connect } from '@tarojs/redux';
import './index.less'
import MySwiper from '../../../components/Swiper/MySwiper';
import icon_Astrolable from '../../../images/home/Astrolabe.png';
import icon_Combine from '../../../images/home/Combine.png';
import icon_Correction from '../../../images/home/Correction.png';
import icon_Diary from '../../../images/home/Diary.png';
import icon_Prediction from '../../../images/home/Prediction.png';


function Index() {

    useEffect(() => {
        console.log(this);
    })

    return (
        <View className='home'>
            <MySwiper />
            <View className='nav'>
                <View className='nav-item'>
                    <Image
                        className='img'
                        src={icon_Astrolable}
                    />
                    <Text className='text'>星盘</Text>
                </View>
                <View className='nav-item'>
                    <Image
                        className='img'
                        src={icon_Combine}
                    />
                    <Text className='text'>合盘</Text>
                </View>
                <View className='nav-item'>
                    <Image
                        className='img'
                        src={icon_Correction}
                    />
                    <Text className='text'>星盘</Text>
                </View>
                <View className='nav-item'>
                    <Image
                        className='img'
                        src={icon_Diary}
                    />
                    <Text className='text'>日记</Text>
                </View>
                <View className='nav-item'>
                    <Image
                        className='img'
                        src={icon_Prediction}
                    />
                    <Text className='text'>预测</Text>
                </View>
            </View>
        </View>
    )

}
Index.config = {
    navigationBarTitleText: '首页'
}

export default Index
