import Taro from '@tarojs/taro';
import BaseComponent from "../../components/BaseComponent";
import { View, Image, Text, Icon } from '@tarojs/components';
import './index.less';
import { connect } from '@tarojs/redux';
import { LIST_ITEM_TYPES } from "../../utils/constants";
import { AtNavBar } from "taro-ui";
import { actionNavBack } from "../../utils/common";
import { ossUrl } from "../../config";

const img_more = ossUrl + 'upload/images/user/more.png';

@connect(({ message }) => ({
    ...message,
}))
class message extends BaseComponent {
    config = {
        navigationBarTitleText: '我的',
    };

    componentDidMount = () => {
        //请求数据
        // this.props.dispatch({
        //     type: 'message/get_msg',
        // });

    }

    goToPage = (e) => {
        Taro.navigateTo({
            url: e.currentTarget.dataset.url,
        })
    }


    render() {
        const { list, data } = this.props;
        console.log(this);
        return (
            <View className='msg-page'>
                {/*导航栏*/}
                <AtNavBar
                    className='nav'
                    onClickLeftIcon={this.actionNavBack}
                    color='#000'
                    title='消息'
                    border={false}
                    leftIconType='chevron-left'
                    fixed={true}
                />
                {/* 列表 */}
                <View className="list">
                    {
                        list && list.map((item) => {
                            return (
                                <View className="list-item" data-url={`${item.link}`}>
                                    <View className="item">
                                        <View className="left">
                                            <Image className='icon-img' src={item.img}></Image>
                                            <View className="text">{item.txt}</View>
                                        </View>
                                        <Image className="right" src={img_more}></Image>
                                    </View>
                                    <View className="line"></View>
                                </View>
                            )
                        })
                    }

                </View>
            </View>
        )
    }
}

export default message;
