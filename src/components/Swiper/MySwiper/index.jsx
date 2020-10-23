import Taro from '@tarojs/taro';
import { View, Swiper, SwiperItem, Image } from '@tarojs/components';
import './index.less';
import top_banner from '../../../images/home/top_banner.png';


/**
 * 左右滑动组件（图片）
 */
function Index() {
    return (
        <View className='myswiper'>
            <Swiper
                className='swiper'
                indicatorColor='#999'
                indicatorActiveColor='#333'
                circular
                indicatorDots
            // autoplay
            >
                <SwiperItem className='swiper-item'>
                    <View className=''>
                        <Image
                            className='img'
                            mode='widthFix'
                            src={top_banner}
                        />
                    </View>
                </SwiperItem>
            </Swiper>
        </View>
    )
}

export default Index

