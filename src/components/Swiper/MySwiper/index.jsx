import Taro from '@tarojs/taro';
import BaseComponent from "../../BaseComponent";
import PropTypes from 'prop-types';
import { View, Swiper, SwiperItem, Image } from '@tarojs/components';
import './index.less';
import {ossUrl} from '../../../config';
import top_banner from '../../../images/home/top_banner.png';
export default class MySwiper extends BaseComponent {

 static propTypes = {
    banner: PropTypes.array,
  };

  static defaultProps = {
    banner: [],
  };

  constructor(props) {
    super(props)

  }

  //单个swiper点击事件
  actionSwiperItem = (e) => {
    let index = e.currentTarget.dataset.index;
    let item = this.props.banner[index];
    if (item) {
      if (item.target == 'local') {
        goToCommonPage(item.link);
      } else {
        window.location.href = item.link;
      }
    }
  }


/**
 * 左右滑动组件（图片）
 */
render() {
     const {banner} = this.props;
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
            {banner && banner.length > 0 && banner.map((item, index) => (
                <SwiperItem className='swiper-item'>
                    <View className=''>
                        <Image
                            className='img'
                            mode='widthFix'
                            src={ossUrl + `${item.image}`}
                        />
                    </View>
                </SwiperItem>
                ))}
            </Swiper>
        </View>
    )
}

}
