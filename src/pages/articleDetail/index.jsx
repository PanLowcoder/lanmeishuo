import Taro, { useEffect } from '@tarojs/taro'
import { View, Text, Image, Input } from '@tarojs/components'
import { AtAvatar, AtNavBar } from 'taro-ui'
import './index.less'

import banner from '../../images/home/banner.jpg';
import share_wechat from '../../images/article/share_wechat.png';
import share_friend from '../../images/article/share_friend.png';
import avatar from '../../images/article/avatar.png';

import heart from '../../images/home/Star_Heart.png';
import star from '../../images/home/Star_Star.png';
import chat from '../../images/home/Star_Chat.png';
import smile from '../../images/article/smile.png';


function Index() {
    useEffect(() => {
        let articleId = this.$router.params.id;
    })
    return (
        <View className='articleDetail'>
            {/*导航栏*/}
            <AtNavBar
                className='nav'
                // onClickLeftIcon={actionNavBack}
                color='#000'
                border={false}
                leftIconType='chevron-left'
                fixed
            />
            <View className="header">
                <View className="title">9月1日十二星座塔罗运势</View>
                <View className="author">
                    <Text className="name">蓝莓说官方</Text>
                    <Text className="time">5小时前</Text>
                </View>
                <Image className='art-img' src={banner}></Image>
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

            </View>
            <View className="footer">
                <View className="line"></View>
                <View className="dis">
                    <Input className='input' type='text' placeholder='写评论' />
                    <Image className='img' src={smile}></Image>
                </View>

            </View>
        </View>
    )

}

Index.config = {
    navigationBarTitleText: '星文详情'
}

export default Index
