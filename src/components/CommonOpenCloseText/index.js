import { Component } from '@tarojs/taro';
import BaseComponent from "../BaseComponent";
import { View, Image } from '@tarojs/components';
import PropTypes from 'prop-types';
import './index.less';
import { ossUrl } from "../../config";

const img_text_open = ossUrl + 'upload/images/common/img_text_open.png'
const img_text_close = ossUrl + 'upload/images/common/img_text_close.png'

/**
 * 展开收起组件
 */
class CommonOpenCloseText extends BaseComponent {
  static propTypes = {
    des: PropTypes.string,//文字
    length: PropTypes.number,//默认显示的长度
    font_size: PropTypes.number,
  }

  static defaultProps = {
    des: '',
    length: 47,
    font_size: 25,
  };

  constructor() {
    super(...arguments)
    this.state = {
      text: '',//处理后，显示的文字
      is_open: 0,
    }
  }

  componentDidMount = () => {
    // //this.log('CommonOpenCloseText componentDidMount length=' + this.props.length + ',font_size=' + this.props.font_size);
    this.processData();

  };

  componentDidUpdate = () => {
    // //this.log('CommonOpenCloseText componentDidUpdate ' + this.state.text);
  };

  //展开/收起被点击
  actionOpenOrClose = (e) => {

    let open = e.currentTarget.dataset.open;
    //this.log('actionOpenOrClose open=' + open);
    this.processData(open);

  }

  //open：1：点击展开；0：点击收起；-1：无操作；
  processData(open) {
    let text = '';
    let temp_is_open = -1;

    if (open == 1) {//1：点击展开；
      temp_is_open = 1;
      text = this.props.des;
    } else if (open == 0) {//0：点击收起；
      temp_is_open = 0;
      text = this.props.des.substring(0, this.props.length) + '...';
    } else if (this.props.des.length + '...'.length <= this.props.length) {//如果总数小于默认的，那么不显示
      //this.log('如果总数小于默认的，那么不显示');
      text = this.props.des;
      temp_is_open = -1;
    } else {//总数大于默认的
      //this.log('总数大于默认的');
      temp_is_open = 0;
      text = this.props.des.substring(0, this.props.length) + '...';
    }
    this.setState({ text: text, is_open: temp_is_open });
    // //this.log('处理后的内容为：' + text);
  }


  render() {
    const { text, is_open } = this.state;
    const { font_size } = this.props;

    return (

      <View className='open-close-page'>
        {text && (
          <View>
            <View className='des' style={'font-size:' + font_size + ';'}>
              {text}
            </View>
            {/*展开/收起*/}
            {is_open != -1 &&
              (<View className='open-close-container' data-open={is_open == 0 ? 1 : 0} onClick={this.actionOpenOrClose}>
                <View className='text'>
                  {is_open == 0 ? '全文' : '收起'}
                </View>
                {/* <Image className='open-close-img' src={is_open == 0 ? img_text_open : img_text_close}></Image> */}
              </View>)}
          </View>
        )}
      </View>

    )
  }
}

export default CommonOpenCloseText;
