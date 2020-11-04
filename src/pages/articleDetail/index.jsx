import Taro, { useEffect } from '@tarojs/taro'
import BaseComponent from "../../components/BaseComponent";
import { View, Text, Image, Input } from '@tarojs/components'
import { AtAvatar, AtNavBar } from 'taro-ui'
import { connect } from '@tarojs/redux';
import { ossUrl } from "../../../config";
import './index.less'
import { actionNavBack, customTime, getCustomImgUrl } from "../../utils/common";
import { getWindowHeight } from "../../utils/style";

const banner = ossUrl + 'upload/images/home/banner.jpg';
const share_wechat = ossUrl + 'upload/images/article/share_wechat.png';
const share_friend = ossUrl + 'upload/images/article/share_friend.png';
const avatar = ossUrl + 'upload/images/article/avatar.png';

const heart = ossUrl + 'upload/images/home/Star_Heart.png';
const star = ossUrl + 'upload/images/home/Star_Star.png';
const chat = ossUrl + 'upload/images/home/Star_Chat.png';
const smile = ossUrl + 'upload/images/article/smile.png';

@connect(({ articleDetail }) => ({
    ...articleDetail,
}))
export default class Detail extends BaseComponent {
    config = {
        navigationBarTitleText: '星文详情',
    };
    constructor() {
        super(...arguments)
        this.state = {
            detail: {},//文章详情
            commentResult: [],//评论列表

            loading: 1, //0：不显示加载中；1：显示加载中；2：显示没有更多了；

            is_show_input: false,//是否显示输入框
            input_content: '',

            scroll_view_height: getWindowHeight(false, true, 0),

            comment_index: '',
            comment_id: '',
            reply_name: '',
            reply_id: '',
            reply_pid: '',

        }
    }

    componentDidMount = () => {
        let articleId = this.$router.params.id;
        //设置文章id
        this.props.dispatch({
            type: 'articleDetail/save',
            payload: {
                articleId: articleId,
            },
        });
        //请求文章详情数据
        this.props.dispatch({
            type: 'articleDetail/detail',
            payload: {
                articleId: articleId,
            },
        }).then((res) => {
            this.setState({ detail: res })
        });
        //请求文章评论列表数据
        // this.props.dispatch({
        //     type: 'articleDetail/comment_list',
        //     payload: {
        //         articleId: articleId,
        //         page: 1,
        //     },
        // }).then((res) => {
        //     //设置数据
        //     let loading = this.state.loading;
        //     if (Number(res.data.last_page) == Number(res.data.current_page)) {//没有更多了
        //         loading = 2;
        //     } else if (Number(res.data.last_page) > Number(res.data.current_page)) {//显示加载中
        //         loading = 1;
        //     }
        //     this.setState({ commentResult: res.data, loading: loading })
        // });
    };

    render() {
        const {
            commentResult,
            detail,
            loading,
            is_show_input,
            scroll_view_height,
            reply_name,
        } = this.state;

        return (
            <View className='detail-page'>
                {/*导航栏*/}
                <AtNavBar
                    className='nav'
                    onClickLeftIcon={this.actionNavBack}
                    color='#000'
                    border={false}
                    leftIconType='chevron-left'
                    fixed
                />
                <View className="top">
                    <View className="header">
                        <View className="title">9月1日十二星座塔罗运势</View>
                        <View className="author">
                            <Text className="name">蓝莓说官方</Text>
                            <Text className="time">5小时前</Text>
                        </View>
                        <View className="art-img">
                            <Image className='img' src={banner}></Image>
                        </View>
                        <View className="label">太阳或上升再白羊座</View>
                    </View>
                    <View className="container">
                        <View className="content">
                            <View className="cate">本周在工作方面:</View>
                            <View className="text">
                                你可能还没从放假的生活中走出来，因此工作时会有些不在状态，在处理一些文书、数据、细节的事情时，容易掉链子，自己要仔细一些。工作中会有突发情况，比如原本定好的约会、合同会临时变卦、改时间，或是有新增的任务，给你造成压力，因此和领导发生冲突。不过这些问题你都能解决好，周末的时候工作就轻松、顺利许多了。
                    </View>
                        </View>
                        <View className="content">
                            <View className="cate">本周在财务方面：</View>
                            <View className="text">
                                资金往来频繁，金钱运势不稳定，现金流会出现突然的中断，或是因为还款而有大笔的支出。
                    </View>
                        </View>
                        <View className="content">
                            <View className="cate">本周在感情方面：</View>
                            <View className="text">
                                你可能还没从放假的生活中走出来，因此工作时会有些不在状态，在处理一些文书、数据、细节的事情时，容易掉链子，自己要仔细一些。工作中会有突发情况，比如原本定好的约会、合同会临时变卦、改时间，或是有新增的任务，给你造成压力，因此和领导发生冲突。不过这些问题你都能解决好，周末的时候工作就轻松、顺利许多了。
                    </View>
                        </View>
                        <View className="event">
                            <View className="share">
                                <Image className='img' src={share_wechat}></Image>
                                <Image className='img' src={share_friend}></Image>
                            </View>
                            <View className="tab">
                                <View className="item">
                                    <Image className='icon' src={heart}></Image>
                                    <Text className='text'>22</Text>
                                </View>
                                <View className="item">
                                    <Image className='icon' src={star}></Image>
                                    <Text className='text'>22</Text>
                                </View>
                                <View className="item">
                                    <Image className='icon' src={chat}></Image>
                                    <Text className='text'>22</Text>
                                </View>
                            </View>
                        </View>
                        <View className="line"></View>
                    </View>
                    <View className="com-list">
                        <View className="com-item">
                            <View className="user">
                                <AtAvatar circle size='small' image={avatar}></AtAvatar>
                                <View className="info">
                                    <View className="name">白日梦想家</View>
                                    <View className="time">3分钟前</View>
                                </View>
                            </View>
                            <View className="comment">
                                <View className="text">跪求桃花运！呜呜呜！</View>
                                <View className="tab">
                                    <View className="item">
                                        <Image className='icon small' src={heart}></Image>
                                        <Text className='text'>22</Text>
                                    </View>
                                    <View className="item">
                                        <Image className='icon small' src={chat}></Image>
                                        <Text className='text'>22</Text>
                                    </View>
                                </View>
                            </View>
                            <View className="line"></View>
                        </View>
                        <View className="com-item">
                            <View className="user">
                                <AtAvatar circle size='small' image={avatar}></AtAvatar>
                                <View className="info">
                                    <View className="name">白日梦想家</View>
                                    <View className="time">3分钟前</View>
                                </View>
                            </View>
                            <View className="comment">
                                <View className="text">跪求桃花运！呜呜呜！</View>
                                <View className="tab">
                                    <View className="item">
                                        <Image className='icon small' src={heart}></Image>
                                        <Text className='text'>22</Text>
                                    </View>
                                    <View className="item">
                                        <Image className='icon small' src={chat}></Image>
                                        <Text className='text'>22</Text>
                                    </View>
                                </View>
                            </View>
                            <View className="line"></View>
                        </View>
                    </View>
                </View>
                <View className="footer">
                    <Input className='input' type='text' placeholder='写评论' />
                    <Image className='img' src={smile}></Image>
                </View>

            </View>
        );
    }
}
