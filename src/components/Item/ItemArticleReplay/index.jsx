import Taro from '@tarojs/taro';
import BaseComponent from "../../BaseComponent";
import { View, Image, Text } from '@tarojs/components';
import PropTypes from 'prop-types';
import './index.less';
import { AtAvatar } from 'taro-ui'
import { ossUrl } from "../../../config";
import { fmtDate, getCustomImgUrl } from "../../../utils/common";

const avatar = ossUrl + 'upload/images/article/avatar.png';
const heart = ossUrl + 'upload/images/home/Star_Heart.png';
const chat = ossUrl + 'upload/images/home/Star_Chat.png';

/**
 * 评论列表单条内容组件
 */
class ItemArticleReplay extends BaseComponent {
    static propTypes = {
        index: PropTypes.number,
        item: PropTypes.object,
        onCommomReplayItemClick: PropTypes.func,//通用的评论单条内容点击事件：0：举报；1：点赞；2：评论；
    }

    static defaultProps = {
        item: '',
    };

    //举报/点赞/评论按钮被点击
    actionCommomReplayItemClick = (e) => {
        let type = e.currentTarget.dataset.type;
        this.props.onCommomReplayItemClick(type, this.props.item.id, this.props.index, e.currentTarget.dataset.name, e.currentTarget.dataset.id, e.currentTarget.dataset.pid);

    }

    render() {
        const { item } = this.props;
        const user = Object(item.user)
        return (
            <View className="com-item">
                <View className="user">
                    <AtAvatar circle size='small' image={avatar}></AtAvatar>
                    <View className="info">
                        <View className="name">{user.nickname}</View>
                        <View className="time">{item.created_at}</View>
                    </View>
                </View>
                <View className="comment">
                    <View className="text">{item.content}</View>
                    <View className="tab">
                        <View className="item">
                            <Image className='icon small' src={heart}></Image>
                            <Text className='text'>{item.count_like}</Text>
                        </View>
                        <View className="item">
                            <Image className='icon small' src={chat}></Image>
                            <Text className='text'>{item.count_comment}</Text>
                        </View>
                    </View>
                </View>
                <View className="line"></View>
            </View>
        )
    }
}

export default ItemArticleReplay;
