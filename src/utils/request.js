import Taro from '@tarojs/taro';
import { baseUrl, noConsole, version } from '../config';
import { removeCache } from "./common";
import axios from 'axios';

//生成唯一的did
function generateUUID() {
    var d = new Date().getTime();
    var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        var r = (d + Math.random() * 16) % 16 | 0;
        d = Math.floor(d / 16);
        return (c == 'x' ? r : (r & 0x3 | 0x8)).toString(16);
    });
    return uuid;
}

// const app_type = Taro.getEnv();
export const app_type = 'ios';
// const app_type = Taro.getSystemInfoSync().platform;
if (Taro.getStorageSync('did')) {
    Taro.setStorageSync('did', generateUUID());
} else {
    // console.log('did is ' + Taro.getStorageSync('did'));
}
// const did = Taro.getStorageSync('did');
export const did = generateUUID();
export const model = Taro.getSystemInfoSync().brand;
export const phone_version = '12.0.1';
export const time = new Date().getTime();
// const version = version;

const encryptJointString = 'app-type=' + app_type + '&did=' + did + '&model=' + model + '&phone-version=' + phone_version + '&time=' + time + '&version=' + version;
const CryptoJS = require('crypto-js');  //引用AES源码js

const key = CryptoJS.enc.Utf8.parse("aiVjKg65lvKaYBuN");  //十六位十六进制数作为密钥
const iv = CryptoJS.enc.Utf8.parse('EPzH5lnC5a47QEYo');   //十六位十六进制数作为密钥偏移量

/**
 * 解密方法
 * @param word
 * @returns {string}
 * @constructor
 */
export function Decrypt(word) {
    let encryptedHexStr = CryptoJS.enc.Base64.parse(word);
    let srcs = CryptoJS.enc.Base64.stringify(encryptedHexStr);
    let decrypt = CryptoJS.AES.decrypt(srcs, key, { iv: iv, mode: CryptoJS.mode.CBC, padding: CryptoJS.pad.Pkcs7 });
    let decryptedStr = decrypt.toString(CryptoJS.enc.Utf8);
    return decryptedStr.toString();
    // return decrypt;
}

/**
 * 加密方法
 * @param word
 * @returns {string}
 * @constructor
 */
export function Encrypt(word) {
    let srcs = CryptoJS.enc.Utf8.parse(word);
    let encrypted = CryptoJS.AES.encrypt(srcs, key, { iv: iv, mode: CryptoJS.mode.CBC, padding: CryptoJS.pad.Pkcs7 });
    let result = encrypted.ciphertext.toString(CryptoJS.enc.Base64);
    return result;
}

export const sign = Encrypt(encryptJointString);
const result = Decrypt(sign);


export const header = {
    'Content-Type': 'application/x-www-form-urlencoded',
    'sign': sign,
    'access-token': Taro.getStorageSync('access_token'),
    'app-type': app_type,
    'did': did,
    'version': version,
    'time': time,
    'model': model,
    'phone-version': phone_version,
};


function getBlob(url, callback) {
    var xhr = new XMLHttpRequest()
    xhr.open('GET', url)
    xhr.responseType = 'blob'
    xhr.onload = () => {
        callback(xhr.response)
    }
    xhr.send()
}

function blobToDataURL(blob, callback) {
    var a = new FileReader();
    a.onload = e => {
        callback(e.target.result);
    }
    a.readAsDataURL(blob);
}

// base64转成bolb对象
function dataURItoBlob(base64Data, type) {
    var byteString;
    if (base64Data.split(",")[0].indexOf("base64") >= 0)
        byteString = atob(base64Data.split(",")[1]);
    else
        byteString = unescape(base64Data.split(",")[1]);
    // var mimeString = base64Data.split(",")[0].split(":")[1].split(";")[0];
    var ia = new Uint8Array(byteString.length);
    for (var i = 0; i < byteString.length; i++) {
        ia[i] = byteString.charCodeAt(i);
    }
    // return new Blob([ia], {type: mimeString});
    return new Blob([ia], { type: type });


}

/**
 * 使用axio 实现图片上传
 * @param url 图片上传地址后缀 例如：/api/v10/img/upload?type=1
 * @param path 例如：{path: "blob:http://192.168.0.193:8088/96e717ef-9cfa-42cf-a678-085ad16e7731", size: 9762, type: "image/png"}
 * @param callback 回调方法，有可能成功或者失败
 */
export function uploadImage(url, path, callback) {
    console.log('url=' + url + ',path=' + path)
    console.log(path)
    let formData = new FormData();
    getBlob(path.path, function (blob) {
        console.log('getBlob')
        console.log(blob)
        blobToDataURL(blob, function (res) {
            console.log('blobToDataURL')
            console.log(res)
            let blob_result = dataURItoBlob(res, path.type);
            // blob_result.filename='file.png'
            console.log(blob_result)
            formData.append("file", blob_result, 'file.' + path.type.split('/')[1]);

            return axios.post(baseUrl + url, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data;',
                    'sign': sign,
                    'access-token': Taro.getStorageSync('access_token'),
                    'app-type': app_type,
                    'did': did,
                    'version': version,
                    'time': time,
                    'model': model,
                    'phone-version': phone_version
                }
            }).then((result1) => {
                console.log('axios post result=')
                console.log(result1)
                callback(result1)
            })
        })
    })
}


/**
 * 公共的请求方法
 * @param options
 * @returns {Promise<T | never>}
 */
export default (options = { method: 'GET', data: {} }, loading) => {
    if (!noConsole) {
        console.log('is_public=' + options.is_public);

        // console.log(`${new Date().toLocaleString()}【 M=${options.url} 】P=${JSON.stringify(header)}`);
        //console.log(`${new Date().toLocaleString()}【 M=${options.url} 】P=${JSON.stringify(options.data)}`);

        // console.log('加密字符串为：'+encryptJointString);
        // console.log('加密后字符串为：'+sign);
        // console.log('解密后字符串为：'+result);

        //console.log(header);
    }
    //是否显示loading
    //显示loading
    if (loading != false) {
        Taro.showLoading({
            title: 'loading',
            mask: true,
        });
    }

    return Taro.request({
        url: baseUrl + options.url,
        data: {
            ...options.data
        },
        header:
        {
            'Content-Type': 'application/x-www-form-urlencoded',
            'sign': sign,
            'access-token': Taro.getStorageSync('access_token'),
            'app-type': app_type,
            'did': did,
            'version': version,
            'time': time,
            'model': model,
            'phone-version': phone_version,
        },
        method: options.method.toUpperCase(),
        mode: 'cors',
    }).then((res) => {
        if (loading != false) {
            Taro.hideLoading();
        }
        const { code, msg } = res.data;
        if (!noConsole) {
            console.log('code =' + code + ',msg=' + msg);
            console.log(`${new Date().toLocaleString()}【 M=${options.url} 】【接口响应：】`, options.data, res.data);
        }
        if (code == '200') {
        } else if (code == '403') {//重新登录
            removeCache()
            Taro.reLaunch({
                url: '/pages/login/index',
            });
        } else {//提示用户
            if (msg) {
                Taro.showToast({
                    title: msg,
                    icon: 'none',
                    mask: false,
                });
            }
        }
        return res.data;
    })
}
