import Taro from '@tarojs/taro';
import BaseComponent from "../../../components/BaseComponent";
import {View, Image} from '@tarojs/components';
import {PLANET} from '../../../utils/constants'
import {actionNavBack} from "../../../utils/common";
import {connect} from '@tarojs/redux';
import './index.scss';
import {AtNavBar} from 'taro-ui';
import {ossUrl} from "../../../config";

const img_detail_left = ossUrl + 'wap/images/astro/predict/img_detail_left.png'
const img_detail_right = ossUrl + 'wap/images/astro/predict/img_detail_right.png'

@connect(({astro}) => ({
  ...astro,
}))
class predictPlanetDetail extends BaseComponent {
  config = {
    navigationBarTitleText: '本命预测',
  };

  constructor() {
    super(...arguments)
    this.state = {
      data: ''
    }
  }

  componentDidUpdate = () => {
    //this.log('weekDetail componentDidUpdate ');
  }

  componentDidMount = () => {
    let index = this.$router.params.index;
    let data = this.props.predict_data.planet_power[index];
    this.log(data);
    this.setState({data: data});

  };

  //点击tab栏
  handleTabsClick(stateName, value) {
    this.setState({
      [stateName]: value
    });
  }

  //点击list
  onClick() {
    //this.log(item)
  }


  render() {
    const {data} = this.state;

    return (
      <View className='predict-detail-page'>
        {/*导航栏*/}
        <AtNavBar
          className='nav'
          onClickLeftIcon={this.actionNavBack}
          color='#000'
          leftIconType='chevron-left'
          fixed
        />

        {data && (
          <View className='detail-container'>
            {/*顶部背景*/}
            <Image
              className='bg'
              src={PLANET(data.id).predict_bg}
            />
            {/*标题*/}
            <View className='title'>{PLANET(data.id).whole}</View>
            {/*描述*/}
            <View className='des'>{data.planet_text.des}</View>
            {/*太阳的状态*/}
            <View className='title'>{PLANET(data.id).whole}的状态</View>

            {/*底部详情内容*/}
            <View className='bottom-con'>
              <Image
                className='left-img'
                src={img_detail_left}
              />
              <View className='detail-con'>
                <View className='top-text'>{data.planet_text.leading_prefix} </View>
                <View className='bottom-text'>{data.planet_text.leading}</View>
              </View>
              <Image
                className='right-img'
                src={img_detail_right}
              />
            </View>
          </View>
        )}
      </View>
    )
  }
}


export default predictPlanetDetail;
