import Taro from '@tarojs/taro';
import BaseComponent from "../../BaseComponent";
import { Swiper, SwiperItem, Image, View } from '@tarojs/components';
import PropTypes from 'prop-types';
import { ossUrl } from '../../../config';
import './index.less';
import { AtBadge } from 'taro-ui'

import { goToCommonPage } from '../../../utils/common'

/**
 * 左右滑动组件（按钮+分页）
 */
export default class MySwiperButtons extends BaseComponent {

  static propTypes = {
    buttons: PropTypes.array,
    page: 2
  };

  static defaultProps = {
    banner: []
  };

  constructor(props) {
    super(props)
    this.state = {}
  }

  componentDidMount = () => {

  }

  actionItemClick = (e) => {
    let index = e.currentTarget.dataset.index;
    let item = this.props.buttons[index];
    this.log('actionItemClick index=' + index);

    goToCommonPage(item.type);
  }

  render() {
    const { buttons } = this.props;
    let pageNum = Math.ceil(buttons.length / 5);
    let pageArray = [];
    for (let page = 0; page < pageNum; page++) {
      let array = [];
      let pageCount = (buttons.length - page * 5) > 5 ? 5 : (buttons.length - page * 5);
      //this.log('page=' + page + ',pageCount=' + pageCount);
      for (let i = 0; i < pageCount; i++) {
        //this.log('page=' + page + ',i=' + i);
        array.push(buttons[i + page * 5]);
      }
      pageArray.push(array);
    }

    return (
      <Swiper
        className='swiper-btns-con'
        indicatorDots
        indicatorColor='#333'
        indicatorActiveColor='#000'
      >
        {pageArray.map((pages, page) => (
          <SwiperItem key={page}>
            {pages.map((item, index) => (
              <View className='item_container' data-index={page * 5 + index} onClick={this.actionItemClick}>
                {item.is_new != 0 && (
                  <AtBadge value='NEW'>
                    <Image className='img' src={ossUrl + `${item.icon}`}></Image>
                  </AtBadge>
                )}
                {item.is_new == 0 && (
                  <Image className='img' src={ossUrl + `${item.icon}`}></Image>
                )}
                <View className='text'>{item.name}</View>
              </View>
            ))}
          </SwiperItem>
        ))}
      </Swiper>
    )
  }
}

