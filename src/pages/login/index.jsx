import Taro, { Component, useEffect } from '@tarojs/taro'
import { View, Text, Input, Image, Checkbox } from '@tarojs/components'
import { connect } from '@tarojs/redux';
import './index.less'

import { AtDivider } from 'taro-ui'
import img_wechat from './../../images/login/img_wechat.png';

function Index(props) {
    useEffect(() => {
        //判断是否已经登录，如果已经登陆了，那么跳转打首页
        let id = Taro.getStorageSync('id');
        if (id) {
            Taro.switchTab({ url: '/pages/tabs/tabHome/index' })
            return;
        }
        let callback = this.$router.params.callback;
        let user_info = this.$router.params.user_info;
        this.log('Login componentDidMount callback=' + callback + ',user_info=' + user_info);
        if (callback) {
            this.props.dispatch({
                type: 'login/save',
                payload: { callback: callback },
            })
        }
        if (user_info) {//微信登录返回的用户信息
            let user_info_decode = decodeURIComponent(user_info);
            this.props.dispatch({
                type: 'login/save',
                payload: {
                    wechat_user_info: user_info_decode
                }
            })
            this.props.dispatch({
                type: 'login/wechat',
            });
        }
    })

    //微信登录
    const actionWechatLogin = () => {
        let url = window.location.href;
        this.log(url)
        window.location.href = baseUrl + '/web/wap/wechat_login?callback_url=' + encodeURIComponent(window.location.href + '?user_info=')

    }

    const getMobile = (event) => {
        const value = event.target.value;
        this.props.mobile = value;
        this.props.dispatch({
            type: 'login/save',
            payload: { mobile: value },
        });
    }

    const getCode = (event) => {
        const value = event.target.value;
        this.props.dispatch({
            type: 'login/save',
            payload: { code: value },
        });
    }

    //登录处理
    const handleLogin = () => {
        // console.log(this.props.mobile.length);
        // if (this.props.mobile == '' || this.props.mobile.length != 11 || this.props.code == '' || this.props.code.length != 6) {
        //     this.showToast('请输入有效的手机号或输入有效验证码！');
        //     return false;
        // }
        this.props.dispatch({
            type: 'login/login',
            payload: {
                code: this.props.code,
                tel: this.props.mobile,
            },
        });
    }

    //获取手机验证码
    const sendSms = () => {
        if (this.props.mobile == '' || this.props.mobile.length != 11) {
            this.showToast('请输入有效的手机号！');
            return false;
        }
        this.props.dispatch({
            type: 'login/sendSms',
            payload: {
                mobile: this.props.mobile,
            },
        }).then(() => {
            this.setIntervalTime();
            if (this.props.erroMessage && this.props.erroMessage != '') {
                clearInterval(setIntervalTime);
                this.showToast(this.props.erroMessage);
            }
        });
    }
    const setIntervalTime = () => {
        clearInterval(setIntervalTime);
        let numConst = 60;
        const setIntervalTime = setInterval(() => {
            numConst--;
            this.props.dispatch({
                type: 'login/save',
                payload: { sending: 1, smsTime: numConst },
            });

            if (numConst == 0 || (this.props.erroMessage && this.props.erroMessage != '')) {
                clearInterval(setIntervalTime);
                this.props.dispatch({
                    type: 'login/save',
                    payload: { sending: 2, erroMessage: '', smsTime: 60 },
                });
            }
        }, 1000);
    }
    return (
        <View className='login'>
            <View className="container">
                <View className="title purple">欢迎</View>
                <View className="box">
                    <Text className="text">手机号码</Text>
                    {/*手机号部分*/}
                    <View className='mobile-con'>
                        <View className='left'>+86&nbsp;<Text className='vertical'>|&nbsp;</Text> </View>
                        <Input
                            className='mobile input'
                            type='tel'
                            name='mobile'
                            maxLength='11'
                            placeholder='请输入手机号'
                            // value={mobile}
                            value=''
                            onInput={getMobile}
                        />
                    </View>

                    {/*验证码部分*/}
                    <View className='code-con'>
                        <View className='left'>
                            <Input
                                className='code input'
                                type='tel'
                                name='code'
                                maxLength='6'
                                placeholder='请输入验证码'
                                // value={code}
                                value=''
                                onInput={getCode}
                            />
                        </View>
                        <View className='code' onClick={sendSms}>重新获取</View>
                        {/* {sending == 2 && <View className='code' onClick={sendSms}>重新获取</View>}
                        {sending == 1 && <View className='code'>{`${smsTime}秒后重发`}</View>}
                        {sending == 0 && <View className='code' onClick={sendSms}>获取验证码</View>} */}
                    </View>

                    {/*协议部分*/}
                    <View className='agreement-con'>
                        {/* <Button className='arreement-btn'></Button> */}
                        <Checkbox value='选中' color="#d1d1d1"></Checkbox>
                        <View className="des">
                            <Text>我已经阅读并同意</Text>
                            <Text className='purple'  >"用户协议"</Text>
                            <Text>和</Text>
                            <Text className='purple' >"隐私政策"</Text>
                        </View>

                    </View>

                    {/*登录按钮*/}
                    <View className='btn-con' onClick={handleLogin}>
                        <View className='btn-text'>进入蓝莓说</View>
                    </View>
                </View>

                {/*微信登录部分*/}
                <View className='wechat-con'>
                    <AtDivider content='其他方式登录' fontColor='#ACAEAD' fontSize='24' />
                    {/*微信登录*/}
                    <View className='img-con' onClick={this.actionWechatLogin}>
                        <Image src={img_wechat} className='wechat-img'></Image>
                        <View className='text'>微信登录</View>
                    </View>
                </View>

            </View>
        </View>
    )

}

Index.config = {
    navigationBarTitleText: '登录'
}

const mapStateToProps = (state) => {
    // console.log(state);
    return {

    }
}

export default connect(mapStateToProps)(Index) 
