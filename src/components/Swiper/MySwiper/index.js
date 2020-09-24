import Taro from '@tarojs/taro';
import BaseComponent from "../../BaseComponent";
import { Swiper, SwiperItem, Image } from '@tarojs/components';
import PropTypes from 'prop-types';
import { ossUrl } from '../../../config';
import './index.less';
import { goToCommonPage } from "../../../utils/common";
import top_banner from '../../../images/home/top_banner.png';

/**
 * 左右滑动组件（图片）
 */
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

  render() {
    const { banner } = this.props;
    return (
      <Swiper
        className='swiper-container'
        circular
        indicatorDots
        indicatorColor='#999'
        indicatorActiveColor='#fff'
        autoplay
      >
        {banner && banner.length > 0 && banner.map((item, index) => (
          <SwiperItem>
            <Image
              className='img'
              mode='scaleToFill'
              // src={ossUrl + `${item.image}`}
              src={top_banner}
              data-index={index}
              onClick={this.actionSwiperItem}
            />
          </SwiperItem>
        ))}
      </Swiper>
    )
  }
}

