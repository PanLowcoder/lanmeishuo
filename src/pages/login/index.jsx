import Taro, { Component, useEffect } from '@tarojs/taro'
import { View, Text, Input, Image, Checkbox } from '@tarojs/components'
import { connect } from '@tarojs/redux';
import './index.less'

import { AtDivider } from 'taro-ui'
import img_wechat from './../../images/login/img_wechat.png';

function Index(props) {
    useEffect(() => {

    })
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
                        // onInput={this.getMobile}input
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
                            // onInput={this.getCode}
                            />
                        </View>
                        <View className='code'>重新获取</View>
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
                    <View className='btn-con'>
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
    console.log(state);
    return {

    }
}

export default connect(mapStateToProps)(Index) 
