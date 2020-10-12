import Taro from '@tarojs/taro';
import BaseComponent from "../../BaseComponent";
import { View, Swiper, SwiperItem, Image } from '@tarojs/components';
import PropTypes from 'prop-types';
import { ossUrl } from '../../../../config';
import './index.less';
import { goToCommonPage } from "../../../../utils/common";
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
                autoplay
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

