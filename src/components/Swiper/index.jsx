import Taro from '@tarojs/taro';
import BaseComponent from "../../BaseComponent";
import { View, Swiper, SwiperItem, Image } from '@tarojs/components';
import PropTypes from 'prop-types';
import { ossUrl } from '../../../config';
import './index.less';
import { goToCommonPage } from "../../../utils/common";
import top_banner from '../../images/home/top_banner.png';


/**
 * 左右滑动组件（图片）
 */
function MySwiper() {
    return (
        <View className='myswiper'>
            <Swiper
                className='test-h'
                indicatorColor='#999'
                indicatorActiveColor='#333'
                circular
                indicatorDots
                autoplay>
                <SwiperItem>
                    <View className='demo-text-1'>
                        <Image
                            className='img'
                            mode='widthFix'
                            src={top_banner}
                            style="width:100%"
                        />
                    </View>
                </SwiperItem>
            </Swiper>
        </View>
    )
}

export default MySwiper

