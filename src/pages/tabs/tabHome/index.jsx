import Taro from '@tarojs/taro'
import BaseComponent from "../../../components/BaseComponent";
import { View, Text, Image } from '@tarojs/components'
import { connect } from '@tarojs/redux';
import { AtProgress } from 'taro-ui'
import './index.less'
import MySwiper from '../../../components/Swiper/MySwiper';
import ArticleList from '../../../components/ArticleList';
import { ossUrl } from "../../../config";

const yellow = ossUrl + 'upload/images/home/yellow.png';
const gray = ossUrl + 'upload/images/home/gray.png';

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
        this.log('home componentDidMount= access_token=' + this.props.access_token);
        if (!this.props.access_token) {
            this.log('跳转到登陆页');
            Taro.navigateTo({
                url: '/pages/login/index?callback=/pages/tabs/tabHome/index',
            })
            return;
        }

        // if (this.props.data) {//当前首页数据不为空，已保存到本地
        //   this.log('当前档首页数据不为空，已保存到本地');
        // } else {
        this.props.dispatch({
            type: 'tabHome/load',
        }).then((data) => {
        })
        // }
    };

    // componentDidMount = () => {
    //   console.log(this);
    // }
    componentDidShow = () => {
        if (this.props.data) {//当前首页数据不为空，已保存到本地
            this.log('当前档首页数据不为空，已保存到本地');
            this.log(this.props.data)
            // alert('当前档首页数据不为空，已保存到本地')
        } else {
            // this.props.dispatch({
            //   type: 'tabHome/load',
            // });
        }
    }

    componentDidUpdate = () => {

        //this.log('home componentDidUpdate ');
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

    //通用的关闭按钮点击事件（公告框、**之日alert）
    onClickAlertShadow = () => {
        this.setState({ show_alert_type: HOME_ALERT_TYPE.NONE })
    }

    render() {
        const { data, tabs } = this.props;
        console.log(data);
        const {
            tabsListValue,
            show_alert_type,
        } = this.state;

        if (!data)
            return

        // let astroTime = '2019';
        // if (data) {
        //   astroTime = fmtDate(data.today_astro.time * 1000);
        // }
        return (
            <View className='page'>
                <MySwiper />
                <View className="container">
                    {/* 导航栏 */}
                    <View className='nav'>
                        {tabs && tabs.map((item) => {
                            return (
                                <View className='nav-item'>
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
                                    <View className="left-text">今日运势</View>
                                    <View className="left-img">
                                        <Image className="img" src={yellow}></Image>
                                        <Image className="img" src={yellow}></Image>
                                        <Image className="img" src={gray}></Image>
                                    </View>
                                </View>
                                <View className="header-right">周运</View>
                            </View>
                            <View className="fortune-content">
                                <View className="des-title">上午好!今天财运满满哦!</View>
                                <View className="des">
                                    <View className='des-img'></View>
                                    <View className="des-content">
                                        <View className="item">
                                            <Text className="text">财富78%</Text>
                                            <View className="progress">
                                                <AtProgress percent={78} color='#FFA256' isHidePercent={true}></AtProgress>
                                            </View>
                                        </View>
                                        <View className="item">
                                            <Text className="text">事业61%</Text>
                                            <View className="progress">
                                                <AtProgress percent={61} color='#FED370' isHidePercent={true}></AtProgress>
                                            </View>
                                        </View>
                                        <View className="item">
                                            <Text className="text">桃花39%</Text>
                                            <View className="progress">
                                                <AtProgress percent={39} color='#FFE4A5' isHidePercent={true}></AtProgress>
                                            </View>
                                        </View>
                                    </View>
                                </View>
                                <View className="textarea">今日适合执行建身计划，比以往事半功倍，但是一定要注意</View>
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
                                <View className="date">2020.08.29 星期六</View>
                                <View className="today-content">
                                    太阳在处女座，木星逆行，木星停滞土星逆行，土星停滞，大信封。
                            </View>
                            </View>
                        </View>
                        {/*文章列表*/}
                        <View className="art-title">
                            <View className="left">
                                <View className="text">星文推荐</View>
                            </View>
                            <View className="right">
                                <View className="more">查看更多</View>
                            </View>
                        </View>
                        <ArticleList list={data && data.article}></ArticleList>
                    </View>
                </View>

            </View>
        )
    }
}
