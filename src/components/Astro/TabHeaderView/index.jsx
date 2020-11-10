import Taro from '@tarojs/taro';
import BaseComponent from "../../BaseComponent";
import {View} from '@tarojs/components';
import {AtTabs} from "taro-ui"
import PropTypes from 'prop-types';
import './index.scss';
import {ASTRO_SYNASTRY_TABS, ASTRO_TABS} from "../../../utils/constants";

/**
 *  星盘或者合盘-顶部tab header组件
 */
class TabHeaderView extends BaseComponent {
  static propTypes = {
    type: PropTypes.number,//类型：0：星盘顶部tab header；1：合盘顶部tab header；
    tab_index: PropTypes.number,//选中的第几个tab
    onTabHeaderSeleted: PropTypes.func,
  }

  static defaultProps = {
    type: 0,
  };

  constructor() {
    super(...arguments)
    this.state = {
      is_show_all: false,
    }
  }

  componentDidMount = () => {
  }

  componentDidUpdate = () => {

  }

  componentWillReceiveProps(nextProps) {
    this.log('TabHeaderView componentWillReceiveProps this.props.tab_index=' + this.props.tab_index)
    this.log('TabHeaderView componentWillReceiveProps nextProps.tab_index=' + nextProps.tab_index)
    


  }

  //tab栏点击
  handleTabsClick(stateName, value) {
    this.setState({
      [stateName]: value
    })
    this.log('tab_index =' + value);

    this.props.onTabHeaderSeleted(value);
  }

  //右侧更多按钮被点击
  actionRightBtnClick = () => {
    this.log('actionRightBtnCliick');
    this.setState({is_show_all: !this.state.is_show_all});
  }

  //显示全部按钮，单个按钮点击事件
  onClickItemBtn = (e) => {
    let index = e.currentTarget.dataset.index;
    this.log('onClickItemBtn index=' + index);
    this.setState({is_show_all: false});
    this.props.onTabHeaderSeleted(index);
  }

  render() {
    const {type, tab_index} = this.props;
    const {is_show_all} = this.state;

    this.log('TabHeaderView render tab_index=' + tab_index)

    this.log('render is_show_all=' + is_show_all + ',tab_index=' + tab_index);
    let list = type == 0 ? ASTRO_TABS : ASTRO_SYNASTRY_TABS

    return (
      <View className='tab-header-con'>
        <View className='top-con'>
          <AtTabs
            className='tab-con'
            swipeable={false}
            scroll
            current={tab_index}
            tabList={list}
            onClick={this.handleTabsClick.bind(this, 'tab_index')}
            // onClick={this.handleTabsClick}
          >
          </AtTabs>

          <View
            className={is_show_all == false ? 'iconfont icon-arrow-right right-btn' : 'iconfont icon-arrow-right right-btn right-btn-down'}
            onClick={this.actionRightBtnClick}
          ></View>
        </View>

        {is_show_all == true && (
          <View className='btn-all-con'>
            <View className='btns-con'>
              {list.map((item, index) => (
                <View className='item-con'>
                  <View
                    className={tab_index == index ? 'item selected' : 'item'}
                    data-index={index}
                    onClick={this.onClickItemBtn}
                    // onClick={this.handleTabsClick.bind(this, 'tab_index')}
                  >
                    {item.title}
                  </View>
                </View>
              ))}
            </View>
            <View className='shadow-con' onClick={this.actionRightBtnClick}></View>
          </View>
        )}
      </View>
    )
  }
}

export default TabHeaderView;
