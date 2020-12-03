import Taro from '@tarojs/taro'
import BaseComponent from "../../../components/BaseComponent";
import { View, Text, Image } from '@tarojs/components'
import { connect } from '@tarojs/redux';
import { AtProgress, AtRate } from 'taro-ui'
import './index.less'
import MySwiper from '../../../components/Swiper/MySwiper';
import ArticleList from '../../../components/ArticleList';
import { ossUrl } from "../../../config";
import { customTime, getAtWeeks, getCustomImgUrl } from "../../../utils/common"

const icon_more = ossUrl + 'upload/images/home/more.png';

const img_Today = ossUrl + 'upload/images/home/today_bg.png';

/**
 * 首页显示的alert
 * @type {{NOTICE: number, NONE: number, REVIVE_DAY: number}}
 */
export const HOME_ALERT_TYPE = {
    NONE: -1,//不显示
    NOTICE: 0,//公告框
    REVIVE_DAY: 1,//**之日
}

@connect(({ tabHome, common, fortune }) => ({
    ...tabHome,
    ...common,
    ...fortune,
}))
export default class tabHome extends BaseComponent {
    config = {
        navigationBarTitleText: '首页',
    };

    constructor() {
        super(...arguments)
        this.state = {
            tabsListValue: 0,//0：你的今日运势；1：十二星座周运；
            show_alert_type: HOME_ALERT_TYPE.NONE,//HOME_ALERT_TYPE
        }
    }

    componentDidMount = () => {
        console.log('home componentDidMount= access_token=' + this.props.access_token);
        if (!this.props.access_token) {
            this.log('跳转到登陆页');
            Taro.navigateTo({
                url: '/pages/login/index?callback=/pages/tabs/tabHome/index',
            })
            return;
        }

        this.props.dispatch({
            type: 'tabHome/load',
        });
    };

    componentDidShow = () => {
        if (this.props.data) {//当前首页数据不为空，已保存到本地
            this.log('当前档首页数据不为空，已保存到本地');
        } else {
            this.props.dispatch({
                type: 'tabHome/load',
            });
        }
    }

    //分享
    onShareAppMessage() {
        return {
            title: '蓝莓说',
            path: '/pages/tabs/tabHome/index',
        }
    };

    // 小程序上拉加载
    onReachBottom() {
        this.props.dispatch({
            type: 'tabHome/save',
            payload: {
                page: this.props.page + 1,
            },
        });
        this.props.dispatch({
            type: 'tabHome/product',
        });
    }

    //幸运星 点击
    actionLuckyStar = () => {
        Taro.navigateTo({ url: '/pages/commonList/index?type=' + LIST_ITEM_TYPES.ITEM_LUCKY })
    }


    //日运和周运tab切换
    actionFortuneTab(stateName, value) {
        //this.log('actionFortuneTab' + value);
        this.setState({
            [stateName]: value
        })
    }

    //日运部分 点击
    actionDay = () => {
        Taro.navigateTo({ url: '/pages/fortune/fortuneDetail/index?tab=0' });
    }

    //周运部分 点击
    actionWeek = () => {
        this.props.dispatch({
            type: 'weekDetail/save',
            payload: {
                in_sign: this.props.data.in_sign,
            }
        })
        Taro.navigateTo({ url: '/pages/fortune/weekDetail/index' });
    }

    //更多星文 点击
    actionArticleMore = () => {
        Taro.navigateTo({ url: '/pages/tabs/tabArticle/index' });
    }

    actionScrollviewClick = (e) => {
        this.log('actionScrollviewClick');
        e.stopPropagation();
    }

    actionItemClick = (e) => {
        let index = e.currentTarget.dataset.index;
        let item = this.props.tabs[index];
        console.log(item.path);
        Taro.navigateTo({ url: item.path })
    }

    render() {
        const { data, tabs } = this.props;
<<<<<<< HEAD
        const fortune_list = data.today_fortune.fortune_list;
=======

>>>>>>> 3603c994ce8a62d5809273cf60a10fc96e23f830
        console.log(data);
        return (
            <View className='page'>
                <MySwiper />
                <View className="container">
                    {/* 导航栏 */}
                    <View className='nav'>
                        {tabs && tabs.map((item, index) => {
                            return (
                                <View className='nav-item' data-index={index} onClick={this.actionItemClick}>
                                    <Image
                                        className='img'
                                        src={item.url}
                                    />
                                    <View className='text'>{item.title}</View>
                                </View>
                            )
                        })}
                    </View>
                    {/* 内容部分 */}
                    <View className="content">
                        {/* 运势 */}
                        <View className="fortune">
                            <View className="fortune-header">
                                <View className="header-left">
                                    <View className="left-text">{data && data.today_fortune.revive_day.name}</View>
                                    <AtRate
                                        className='left-img'
                                        size='15'
                                        max={3}
                                        value={data && data.today_fortune.revive_day.star_level}
                                    />
                                </View>
                                <View className="header-right">
                                    <Text className='text'>周运</Text>
                                    <Image className='icon' src={icon_more}></Image>
                                </View>
                            </View>
                            <View className="fortune-content">
                                <View className="des-title">上午好!今天财运满满哦!</View>
                                <View className="des">
                                    <Image className='des-img' src={data && getCustomImgUrl(data.today_fortune.revive_day.icon_url)}></Image>
                                    <View className="des-content">
                                    {fortune_list.map((item, index) => (
                                        <View className="item">
                                            <Text className="text">{item.name}   {Math.floor(item.score)}%</Text>
                                            <View className="progress">
                                                <AtProgress percent={item.score} color={item.color} isHidePercent={true}></AtProgress>
                                            </View>
                                        </View>
                                    ))}
                                    </View>
                                </View>
                                <View className="textarea">{data && data.today_fortune.revive_day.tips}</View>
                            </View>
                        </View>
                        {/* 今日天象 */}
                        <View className="today">
                            <Image
                                className='img'
                                mode="widthFix"
                                src={img_Today}
                            />
                            <View className="info">
                                <View className="date">{customTime(data.today_astro.time, 13)}</View>
                                <View className="today-content">{data && data.today_astro.tips}</View>
                            </View>
                        </View>
                        {/*文章列表*/}
                        <View className="art-title">
                            <View className="left">
                                <View className="text">星文推荐</View>
                            </View>
                            <View className="right">
                                <Text className='text'>查看更多</Text>
                                <Image className='icon' src={icon_more}></Image>
                            </View>
                        </View>
                        <ArticleList list={data && data.article}></ArticleList>
                    </View>
                </View>

            </View>
        )
    }
}
