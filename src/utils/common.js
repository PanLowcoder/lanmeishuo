import Taro from '@tarojs/taro'
import { CONS, LIST_ITEM_TYPES, PAGES, PAY_GOODS, SHARE_CONTENT } from "./constants";
import { baseUrl, domainUrl, ossUrl, version } from "../config";
import { get_wechat_sign } from "../models/service";
// import wx from 'weixin-js-sdk'
// import { pay_rectification } from "../pages/rectification/service";
import { Decrypt, Encrypt, sign, app_type, did, time, model, phone_version } from "./request";

export const promisify = (func, ctx) => {
    // 返回一个新的function
    return function() {
        // 初始化this作用域
        var ctx = ctx || this;
        // 新方法返回的promise
        return new Promise((resolve, reject) => {
            // 调用原来的非promise方法func，绑定作用域，传参，以及callback（callback为func的最后一个参数）
            func.call(ctx, ...arguments, function() {
                // 将回调函数中的的第一个参数error单独取出
                var args = Array.prototype.map.call(arguments, item => item);
                var err = args.shift();
                // 判断是否有error
                if (err) {
                    reject(err)
                } else {
                    // 没有error则将后续参数resolve出来
                    args = args.length > 1 ? args : args[0];
                    resolve(args);
                }
            });
        })
    };
};

// 下载图片
// export const downLoadImg = (imgurl, msg) => {
//   return new Promise((resolve, reject) => {
//     let that = this
//     // util.showToast(msg + 'download...')
//     wx.downloadFile({
//       url: imgurl,
//       complete: function (res) {
//         if (res.statusCode === 200) {
//           resolve(res.tempFilePath)
//         } else {
//           //console.log('downloadstatusCode', res)
//           reject(new Error(res))
//         }
//       },
//       fail: function (res) {
//         //console.log('downloadFilefail', res)
//       }
//     })
//   })
// }

export const promiseImage = (url) => {
    return new Promise(function(resolve, reject) {
        resolve(url)
    })
}

export const isChinese = (str) => {
    if (escape(str).indexOf("%u") < 0) return false
    return true
}

export const handleName = (str) => {
    let res = emoj2str(str)
    if (isChinese(res)) {
        res = res.length > 4 ? res.slice(0, 4) + '...' : res
    } else {
        res = res.length > 7 ? res.slice(0, 7) + '...' : res
    }
    return res
}

export const emoj2str = (str) => {
        return unescape(escape(str).replace(/\%uD.{3}/g, ''))
    }
    /*获取当前页url*/
export const getCurrentPageUrl = () => {
    let pages = getCurrentPages()
    let currentPage = pages[pages.length - 1]
    let url = currentPage.route
    return url
}

// export const getSysteminfo = () => {
//   try {
//     let deviceInfo = wx.getSystemInfoSync()
//     const device = JSON.stringify(deviceInfo)
//   } catch (e) {
//     this.error('not support getSystemInfoSync api', err.message)
//   }
//   return device
// }

export const timeago = dateTimeStamp => { //dateTimeStamp是一个时间毫秒，注意时间戳是秒的形式，在这个毫秒的基础上除以1000，就是十位数的时间戳。13位数的都是时间毫秒。
    let minute = 1000 * 60; //把分，时，天，周，半个月，一个月用毫秒表示
    let hour = minute * 60;
    let day = hour * 24;
    let week = day * 7;
    let halfamonth = day * 15;
    let month = day * 30;
    let now = new Date().getTime(); //获取当前时间毫秒
    let diffValue = now - dateTimeStamp; //时间差

    if (diffValue < 0) {
        return;
    }
    let minC = diffValue / minute; //计算时间差的分，时，天，周，月
    let hourC = diffValue / hour;
    let dayC = diffValue / day;
    let weekC = diffValue / week;
    let monthC = diffValue / month;
    let result = null
    if (monthC >= 1 && monthC <= 3) {
        result = " " + parseInt(monthC) + " month(s) ago"
    } else if (weekC >= 1 && weekC <= 3) {
        result = " " + parseInt(weekC) + " week(s) ago"
    } else if (dayC >= 1 && dayC <= 6) {
        result = " " + parseInt(dayC) + " day(s) ago"
    } else if (hourC >= 1 && hourC <= 23) {
        result = " " + parseInt(hourC) + " hour(s) ago"
    } else if (minC >= 1 && minC <= 59) {
        result = " " + parseInt(minC) + " minute(s) ago"
    } else if (diffValue >= 0 && diffValue <= minute) {
        result = "just now"
    } else {
        let datetime = new Date();
        datetime.setTime(dateTimeStamp);
        let Nyear = datetime.getFullYear();
        let Nmonth = datetime.getMonth() + 1 < 10 ? "0" + (datetime.getMonth() + 1) : datetime.getMonth() + 1;
        let Ndate = datetime.getDate() < 10 ? "0" + datetime.getDate() : datetime.getDate();
        let Nhour = datetime.getHours() < 10 ? "0" + datetime.getHours() : datetime.getHours();
        let Nminute = datetime.getMinutes() < 10 ? "0" + datetime.getMinutes() : datetime.getMinutes();
        let Nsecond = datetime.getSeconds() < 10 ? "0" + datetime.getSeconds() : datetime.getSeconds();
        result = Nyear + "-" + Nmonth + "-" + Ndate + ' ' + Nhour + ':' + Nminute + ':' + Nsecond
    }
    return result;
}

/**
 * 处理时间
 * @param timestamp 时间戳或者Date类型时间
 * @param type 时间类型1-13
 * @param is_date 是否是Date类型
 * @returns {*}
 */
export function customTime(timestamp, type, is_date = false) {
    let date;
    if (is_date) {
        date = timestamp;
    } else {
        date = new Date(timestamp * 1000);
    }

    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const hour = date.getHours();
    const minute = date.getMinutes();
    switch (Number(type)) {
        case 1:
            return year + '/' + customTen(month) + '/' + customTen(day) + ' ' + customTen(hour) + ':' + customTen(minute);
        case 2:
            return year + '.' + customTen(month) + '.' + customTen(day) + ' ' + customTen(hour) + ':' + customTen(minute);
        case 3:
            return year + '-' + customTen(month) + '-' + customTen(day) + ' ' + customTen(hour) + ':' + customTen(minute);
        case 4:
            return year + '-' + customTen(month) + '-' + customTen(day);
        case 5:
            return year + '-' + customTen(month);
        case 6:
            return customTen(hour) + ':' + customTen(minute);
        case 7:
            return customTen(month) + '.' + customTen(day);
        case 8:
            return year;
        case 9:
            return customTen(month);
        case 10:
            return customTen(day);
        case 11:
            return customTen(hour);
        case 12:
            return customTen(minute);
        case 13:
            return year + '.' + customTen(month) + '.' + customTen(day);
    }

}


export function formatTime(date, is_show_second) {
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const hour = date.getHours();
    const minute = date.getMinutes();
    const second = date.getSeconds();
    let list = [hour, minute, second];
    if (is_show_second == false) {
        list = [hour, minute];
    }
    return [year, month, day].map(formatNumber).join('-') + ' ' + list.map(formatNumber).join(':');
}

export const formatNumber = n => {
    n = n.toString()
    return n[1] ? n : '0' + n
}

export const hasLogin = () => {
    return Taro.getStorageSync('Authorization').length > 0
}

/**
 * 时间戳转换日期
 * @param obj
 * @returns {string}
 */
export function fmtDate(obj) {
    var date = new Date(obj);
    var y = 1900 + date.getYear();
    var m = "0" + (date.getMonth() + 1);
    var d = "0" + date.getDate();
    return y + "-" + m.substring(m.length - 2, m.length) + "-" + d.substring(d.length - 2, d.length);
}

/**
 * 把时间转换为日期【年-月-日】
 * @param date
 * @param type
 * @returns {string}
 */
export function formatDate(date) {
    //console.log(date);
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();
    return [year, month, day].map(formatNumber).join('-');
}


/**
 * 根据时间文字，获取当前的周
 * @param dateStr
 * @param separator
 * @returns {string}
 */
export function getAtWeeks(dateStr, separator) {

    //把字符串转化为date类型
    if (!separator) {
        separator = "-";
    }
    var dateArr = dateStr.split(separator);
    var year = parseInt(dateArr[0]);
    var month;
    //处理月份为04这样的情况
    if (dateArr[1].indexOf("0") == 0) {
        month = parseInt(dateArr[1].substring(1));
    } else {
        month = parseInt(dateArr[1]);
    }
    var day = parseInt(dateArr[2]);
    var Nowdate = new Date(year, month - 1, day);

    //获取本周第一天
    var WeekFirstDay = new Date(Nowdate - (Nowdate.getDay() - 1) * 86400000);
    var M = Number(WeekFirstDay.getMonth()) + 1
    var month = M;
    if (M < 10) {
        month = '0' + M;
    }

    //获取本周最后一天
    var WeekLastDay = new Date((WeekFirstDay / 1000 + 6 * 86400) * 1000);
    var lastM = Number(WeekLastDay.getMonth()) + 1;
    if (lastM < 10) {
        lastM = '0' + lastM;
    }
    return month + "." + WeekFirstDay.getDate() + '-' + lastM + '.' + WeekLastDay.getDate();
}

/**
 * 把日期时间字符串 转换为 date对象
 * @param dateString 输入的时间格式为yyyy-MM-dd hh:mm
 * @returns {Date}
 */
export function convertDateFromString(dateString) {
    console.log('convertDateFromString dateString=' + dateString)
    if (dateString) {
        var arr1 = dateString.split(" ");
        var sdate = arr1[0].split('-');
        var stime = arr1[1].split(':');
        var date = new Date(sdate[0], sdate[1] - 1, sdate[2], stime[0], stime[1]);
        return date;
    }
}

/**
 * 获取指定的间隔时间
 * @param timeStr 输入的时间格式为yyyy-MM-dd hh:mm
 * @param type 1：当前以后一小时；-1：当前之前一小时；2：后一天；-2：前一天；3：后一周；-3：一周前；4：一个月后；-4：一个月前；5：一年后；-5：一年前；
 * @returns {*} 返回的时间格式为yyyy-MM-dd hh:mm
 */
export function getSepTimeFromStr(timeStr, type) {
    let date = convertDateFromString(timeStr)

    let result_date;

    let timestamp = 0
    let type_abs = Math.abs(type)
    let type_add_or_sub = type < 0 ? -1 : 1
    if (1 == type_abs) {
        //间隔一小时
        timestamp = 60 * 60 * type_add_or_sub
    } else if (2 == type_abs) {
        //间隔一天
        timestamp = 60 * 60 * 24 * type_add_or_sub
    } else if (3 == type_abs) {
        //间隔一周
        timestamp = 60 * 60 * 24 * 7 * type_add_or_sub
    } else if (4 == type_abs) {
        let year = date.getFullYear()
        let month = date.getMonth() + type_add_or_sub;
        if (type_add_or_sub < 0) {
            if (month == 0) {
                year = year - 1;
                month = 12;
            }
        } else {
            if (month == 13) {
                year = year + 1;
                month = 1;
            }
        }
        date = new Date(year, month, date.getDay(), date.getHours(), date.getMinutes());
    } else if (5 == type_abs) {
        let year = date.getFullYear()
        date = new Date(year + type_add_or_sub, date.getMonth(), date.getDay(), date.getHours(), date.getMinutes());
    }

    result_date = new Date(date.getTime() + timestamp * 1000)
    return customTime(result_date, 3, true)
}


/**
 * 把字符串转换为日期
 * @param dateStr
 * @param separator
 * @returns {Date}
 */
export function getDateFromStr(dateStr, separator) {

    //把字符串转化为date类型
    if (!separator) {
        separator = "-";
    }
    var dateArr = dateStr.split(separator);
    var year = parseInt(dateArr[0]);

    var month;
    var days = new Date(year, month, 0);
    days = days.getDate(); //获取当前日期中月的天数
    var year2 = year;
    var month2 = parseInt(month) - 1;
    if (month2 == 0) {
        year2 = parseInt(year2) - 1;
        month2 = 12;
    }
    var day2 = day;
    var days2 = new Date(year2, month2, 0);
    days2 = days2.getDate();
    if (day2 > days2) {
        day2 = days2;
    }
    if (month2 < 10) {
        month2 = '0' + month2;
    }

    return Nowdate;
}

/**
 * 获取上一个月
 *
 * @date 格式为yyyy-mm-dd的日期，如：2014-01-25
 */
export function getPreMonthFromStr(date) {
    var arr = date.split('-');
    var year = arr[0]; //获取当前日期的年份
    var month = arr[1]; //获取当前日期的月份
    var day = arr[2]; //获取当前日期的日
    var days = new Date(year, month, 0);
    days = days.getDate(); //获取当前日期中月的天数
    var year2 = year;
    var month2 = parseInt(month) - 1;
    if (month2 == 0) {
        year2 = parseInt(year2) - 1;
        month2 = 12;
    }
    var day2 = day;
    var days2 = new Date(year2, month2, 0);
    days2 = days2.getDate();
    if (day2 > days2) {
        day2 = days2;
    }
    if (month2 < 10) {
        month2 = '0' + month2;
    }
    var t2 = year2 + '-' + month2 + '-' + day2;
    return t2;
}

/**
 * 获取下一个月
 *
 * @date 格式为yyyy-mm-dd的日期，如：2014-01-25
 */
export function getNextMonthFromStr(date) {
    var arr = date.split('-');
    var year = arr[0]; //获取当前日期的年份
    var month = arr[1]; //获取当前日期的月份
    var day = arr[2]; //获取当前日期的日
    var days = new Date(year, month, 0);
    days = days.getDate(); //获取当前日期中的月的天数
    var year2 = year;
    var month2 = parseInt(month) + 1;
    if (month2 == 13) {
        year2 = parseInt(year2) + 1;
        month2 = 1;
    }
    var day2 = day;
    var days2 = new Date(year2, month2, 0);
    days2 = days2.getDate();
    if (day2 > days2) {
        day2 = days2;
    }
    if (month2 < 10) {
        month2 = '0' + month2;
    }

    var t2 = year2 + '-' + month2 + '-' + day2;
    return t2;
}


/**
 * 获取自己的档案
 * @returns {*}
 */
export function getSelfRecord() {
    let record_self;
    let all_records = Taro.getStorageSync('store_record_list');
    if (all_records && all_records.length > 0)
        for (let i = 0; i < all_records.length; i++) {
            if (all_records[i].isself == '1') {
                record_self = all_records[i];
            }
        }
        //如果自己的档案获取成功，那么保存到list中
    if (record_self) {
        return record_self;
    } else {
        return '';
    }
}


/**
 * 获取rid的档案
 * @returns {*}
 */
export function getRecord(rid) {
    let record = {};
    let all_records = Taro.getStorageSync('store_record_list');
    ////console.log(all_records);
    for (let i = 0; i < all_records.length; i++) {
        if (all_records[i].id == rid) {
            record = all_records[i];
        }
    }
    return record;
}


/**
 * 根据id获取档案袋
 * @returns {*}
 */
export function getCat(id) {
    let cat = {};
    let all_cats = Taro.getStorageSync('store_cat_list');
    for (let i = 0; i < all_cats.length; i++) {
        if (all_cats[i].id == id) {
            cat = all_cats[i];
        }
    }
    return cat;
}

/**
 * 根据档案袋的cid获取档案列表
 * @returns {*}
 */
export function getRecordsWithCatId(cid) {
    let records = [];
    let cat_rids = Taro.getStorageSync('store_cat_rid_list');
    cat_rids.forEach((item) => {
        if (item.cid == cid) {
            records.push(getRecord(item.rid));
        }
    })
    return records;
}


/**
 * 判断是否是微信浏览器的函数
 * @returns {boolean}
 */
export function isWeiXin() {
    //window.navigator.userAgent属性包含了浏览器类型、版本、操作系统类型、浏览器引擎类型等信息，这个属性可以用来判断浏览器类型
    var ua = window.navigator.userAgent.toLowerCase();
    //通过正则表达式匹配ua中是否含有MicroMessenger字符串
    if (ua.match(/micromessenger/i) == 'micromessenger') {
        return true;
    } else {
        return false;
    }
}


/**
 * 根据档案获取日月升
 * @param record
 * @returns {string}
 */
export function getAscFromRecord(record) {
    if (record) {
        // return '日' + CONS[record.sun.split('-')[0] - 1].item + '月' + CONS[record.moon.split('-')[0] - 1].item + '升' + CONS[record.asc.split('-')[0] - 1].item;

        return getAscFromIndex(record.sun.split('-')[0], record.moon.split('-')[0], record.asc.split('-')[0])
    } else {
        return '';
    }
}

/**
 * 获取日云升
 * @param sun
 * @param moon
 * @param asc
 * @returns {string}
 */
export function getAscFromIndex(sun, moon, asc) {
    let int_sun = parseInt(sun)
    let int_moon = parseInt(moon)
    let int_asc = parseInt(asc)
    return '日' + CONS[int_sun - 1].item + '月' + CONS[int_moon - 1].item + '升' + CONS[int_asc - 1].item;
}

/**
 * 获取档案的名字，如果是自己的话，那么就返回自己
 * @param record
 * @returns {*}
 */
export function getNameFromRecord(record) {
    if (record) {
        if (record.isself == 1) {
            return '自己';
        } else {
            return record.name;
        }
    } else {
        return '';
    }
}


/**
 * 根据档案返回图片，如果图片为空，那么返回默认的太阳星座图片，（如果都为空，那么返回默认传入的图片）
 * @param record
 * @param img
 * @returns {*}
 */
export function getImgFromRecord(record, img, isGetSnastryImg) {
    if (record) {
        if (isGetSnastryImg)
            return CONS[(record.sun.split('-')[0] - 1)].snastry_img;
        if (record.avatar == '') {
            return CONS[(record.sun.split('-')[0] - 1)].record_default_avatar;
        } else {
            if (isGetSnastryImg) {
                return CONS[(record.sun.split('-')[0] - 1)].record_default_avatar;
            } else {
                return ossUrl + record.avatar;
            }

        }
    } else {
        return img;
    }
}

/**
 * 截取字符串，超过 max 以 ... 结尾
 * @param str
 * @param max
 * @returns {*}
 */
export function getSubString(str, max) {
    if (str.length > max) {
        return str.substring(0, max) + '...'
    } else {
        return str;
    }
}

/**
 * 小于10，那么前面加0，大于10，那么不做处理
 * @param v
 * @returns {*}
 */
export function customTen(v) {
    if (Number(v) < 10) {
        return '0' + v;
    } else {
        return v;
    }
}

/**
 * 检查str是否为空
 * @param str
 * @returns {boolean}
 */
export function isEmpty(str) {
    if (!str || str == '' || str == 'undefined') {
        return true
    } else {
        return false
    }
}


/**
 * 显示toast
 * @param msg
 */
export function showToast(msg) {
    Taro.showToast({
        title: msg,
        icon: 'none',
        mask: false,
    });
}


/**
 * 显示没做的toast
 * @param msg
 */
export function showToastToDo(msg) {
    if (!msg) {
        msg = '未完成';
    }
    Taro.showToast({
        title: msg,
        icon: 'none',
        mask: false,
    });
}

/**
 * 通用跳转
 * @param url 跳转url
 * @param is_need_login 是否需要登录，默认false
 */
export function goToPage(url = '', is_need_login = false) {
    if (Taro.getEnv() === Taro.ENV_TYPE.WEB) {
        Taro.navigateTo({
            url: url,
        })
    } else {
        Taro.switchTab({
            url: url,
        })
    }
}

export function makePhoneCall() {
    if (Taro.getEnv() === Taro.ENV_TYPE.WEB) {
        window.location.href = "tel:123456";
    } else {
        Taro.makePhoneCall({
            phoneNumber: '123456'
        })
    }
}

/**
 * 获取图片地址
 * @param url
 * @returns {string|*}
 */
export function getCustomImgUrl(url) {
    if (!url)
        return ossUrl + 'wap/images/user/img_avatar_default.png';
    var fdStart = url.indexOf("http");
    if (fdStart == 0) {
        return url;
    } else if (fdStart == -1) {
        return ossUrl + url;
    }

}


/**
 * 获取支付方式
 * @param pay pay=[0：微信；1：支付宝；];
 * @returns {string} trade_type:6:微信公众号支付；7:支付宝h5支付；8：微信h5支付;
 */
export function getTradeType(pay) {
    return pay == 0 ? (isWeiXin() ? '6' : '8') : '7';
}

/**
 * 支付请求
 * @param pay_type 0：微信；1：支付宝；
 * @param type 商品类型
 * @param param_data 参数
 */
// export function requestPay(pay_type, type, param_data) {
//   // alert(type)
//   // alert(JSON.stringify(param_data))
//   if (isWeiXin() && !param_data.openid) {//微信公众号支付，并且本地保存的openid不存在，那么去获取openid
//     let url = baseUrl + '/web/wap/wechat_login?callback_url=' + encodeURIComponent(window.location.href + '&user_info=');
//     // alert(url)
//     window.location.href = url;
//     return;
//   }
//   requestPayOrder(pay_type, type, param_data);
// }

//支付请求
// async function requestPayOrder(pay_type, type, param_data) {
//   let res = {};
//   switch (parseInt(type)) {
//     case PAY_GOODS.PAY_GOODS_RECTIFICATION: {
//       res = await pay_rectification(param_data);
//       break;
//     }
//   }

//   if (res && res.code == '200') {//0：微信；1：支付宝；
//     // alert(JSON.stringify(res))
//     if (0 == pay_type) {
//       if (isWeiXin()) {//微信公众号支付
//         wxPay(res.data.appId, res.data.nonceStr, res.data.package, res.data.paySign, res.data.signType, res.data.timeStamp, PAY_GOODS.PAY_GOODS_RECTIFICATION, param_data.id);
//       } else {//浏览器h5微信支付
//         // alert('微信h5支付 res.data.mweb_url=' + res.data.mweb_url)
//         window.location.href = res.data.mweb_url;
//       }
//     } else if (1 == pay_type) {//浏览器h5支付宝支付
//       // alert('未实现');
//       var reHtml = res.data.par_form;
//       var div = document.createElement('div');
//       div.innerHTML = reHtml;
//       document.body.appendChild(div);
//       document.forms[0].submit();
//     }
//   }
// }

/**
 * 微信公众号支付
 * @param appId
 * @param nonceStr
 * @param packageStr
 * @param paySign
 * @param signType
 * @param timeStamp
 * @param type 2：运势订单；3：占星地图订单；
 * @param order_id 订单id；
 */
export function wxPay(appId, nonceStr, packageStr, paySign, signType, timeStamp, type, order_id) {
    let log = 'appid=' + appId + ',nonceStr=' + nonceStr + ',packageStr=' + packageStr + ',paySign=' + paySign + ',signType=' + signType + ',timeStamp=' + timeStamp;

    //console.log(log)
    // alert(log)
    if (typeof WeixinJSBridge === "undefined") {
        if (document.addEventListener) {
            document.addEventListener('WeixinJSBridgeReady', onBridgeReady, false)
        } else if (document.attachEvent) {
            document.attachEvent('WeixinJSBridgeReady', onBridgeReady)
            document.attachEvent('onWeixinJSBridgeReady', onBridgeReady)
        }
    } else {
        // const {appid, nonceStr, packageStr, paySign, signType, timeStamp} = data // 服务器返回的参数
        WeixinJSBridge.invoke(
            'getBrandWCPayRequest', {
                appId: appId,
                timeStamp: timeStamp.toString(),
                nonceStr: nonceStr,
                package: packageStr,
                signType: signType,
                paySign: paySign
            },
            function(res) {
                // alert(JSON.stringify(res))
                if (res.err_msg === "get_brand_wcpay_request:ok") {
                    showToast('支付成功');
                    switch (parseInt(type)) {
                        case PAY_GOODS.PAY_GOODS_RECTIFICATION:
                            {
                                Taro.navigateTo({ url: '/pages/rectification/resultDetail/index?id=' + order_id })
                                break;
                            }
                        case PAY_GOODS.PAY_GOODS_FORTUNE:
                            {
                                goToCommonPage(PAGES.PAGE_ORDER_DETAILS, '?type=' + type + '&id=' + order_id);
                                break;
                            }
                        case PAY_GOODS.PAY_GOODS_MAP:
                            {
                                goToCommonPage(PAGES.PAGE_ORDER_DETAILS, '?type=' + type + '&id=' + order_id);
                                break;
                            }
                    }

                } else if (res.err_msg === "get_brand_wcpay_request:cancel") {
                    showToast('取消支付');
                } else if (res.err_msg === "get_brand_wcpay_request:fail") {
                    showToast('支付失败');
                }
            }
        )
    }
}


export function jsSdkConfig() {

    const ua = window.navigator.userAgent.toLowerCase()
        // 如果不在微信浏览器内，微信分享也没意义了对吧？这里判断一下
    if (ua.indexOf('micromessenger') < 0) return false

    // 最好在在 router 的全局钩子里调用这个方法，每次页面的 URL 发生变化时，都需要重新获取微信分享参数
    // 如果你的 router 使用的是 hash 形式，应该不用每次都重新获取微信分享参数
    //   const data = $ajax.post({
    //     url: '当前页面的 URL',
    //     // xxx
    //     // xxx
    //   })


    // let u = window.navigator.userAgent;
    // let isAndroid = u.indexOf('Android') > -1 || u.indexOf('Adr') > -1; //android终端
    // let isiOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); //ios终端
    // //安卓需要使用当前URL进行微信API注册（即当场调用location.href.split('#')[0]）
    // //iOS需要使用进入页面的初始URL进行注册，（即在任何pushstate发生前，调用location.href.split('#')[0]）
    // let url = 'http://192.168.0.193:8088/#/pages/tabs/tabUser/index'
    // let url='https://wechat.goddessxzns.com'
    let url = window.location.href;
    // url = encodeURIComponent(window.location.href.split('#')[0]);
    // url = baseUrl+'/';
    alert(url)
        // //console.log(url)

    getWechatSignRequest(url)


}

async function getWechatSignRequest(url) {
    let res = await get_wechat_sign({
        url
    });
    // if (res.code == '200') {
    //   wx.config({
    //     debug: true, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
    //     appId: res.data.appId, // 必填，企业号的唯一标识，此处填写企业号corpid
    //     timestamp: res.data.timestamp, // 必填，生成签名的时间戳（10位）
    //     nonceStr: res.data.nonceStr, // 必填，生成签名的随机串,注意大小写
    //     signature: res.data.signature,// 必填，签名，见附录1（通过https://mp.weixin.qq.com/debug/cgi-bin/sandbox?t=jsapisign 验证）
    //     jsApiList: [
    //       'onMenuShareAppMessage',
    //       'onMenuShareTimeline'
    //     ] // 必填，需要使用的JS接口列表，所有JS接口列表见附录2
    //   })

    //   wx.error((err) => {
    //     //console.log('wx error by mark')
    //     this.error(JSON.stringify(err))
    //   })

    //   wx.ready(() => {
    //     //console.log('wx.ready')
    //     // wx.updateAppMessageShareData({
    //     //   title: SHARE_CONTENT.title, // 分享标题
    //     //   desc: SHARE_CONTENT.desc, // 分享描述
    //     //   link: SHARE_CONTENT.url, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
    //     //   imgUrl: SHARE_CONTENT.img_url, // 分享图标
    //     //   success: function () {
    //     //     // 用户确认分享后执行的回调函数
    //     //     //console.log('分享成功')
    //     //   },
    //     //   cancel: function () {
    //     //     // 用户取消分享后执行的回调函数
    //     //     //console.log('取消分享')
    //     //   }
    //     // })

    //     //分享给朋友
    //     wx.onMenuShareAppMessage({
    //       title: SHARE_CONTENT.title, // 分享标题
    //       desc: SHARE_CONTENT.desc, // 分享描述
    //       link: url, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
    //       imgUrl: SHARE_CONTENT.img_url, // 分享图标
    //       type: '', // 分享类型,music、video或link，不填默认为link
    //       dataUrl: '', // 如果type是music或video，则要提供数据链接，默认为空
    //       success: function () {
    //         // 用户确认分享后执行的回调函数
    //         //console.log('分享成功')
    //       },
    //       cancel: function () {
    //         // 用户取消分享后执行的回调函数
    //         //console.log('取消分享')
    //       }
    //     })
    //     //
    //     // //分享到朋友圈
    //     // wx.onMenuShareTimeline({
    //     //   title: '', // 分享标题
    //     //   link: url, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
    //     //   imgUrl: '', // 分享图标
    //     //   success: function () {
    //     //     // 用户确认分享后执行的回调函数
    //     //   },
    //     //   cancel: function () {
    //     //     // 用户取消分享后执行的回调函数
    //     //   }
    //     // })


    //   })

    //   // window.wx.config({
    //   //   debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
    //   //   appId: res.data.appId, // 必填，企业号的唯一标识，此处填写企业号corpid
    //   //   timestamp: res.data.timestamp, // 必填，生成签名的时间戳（10位）
    //   //   nonceStr: res.data.nonceStr, // 必填，生成签名的随机串,注意大小写
    //   //   signature: res.data.signature,// 必填，签名，见附录1（通过https://mp.weixin.qq.com/debug/cgi-bin/sandbox?t=jsapisign 验证）
    //   //   jsApiList: [
    //   //     'getLocation',
    //   //     'onMenuShareTimeline',
    //   //     'onMenuShareAppMessage'
    //   //   ] // 必填，需要使用的JS接口列表，所有JS接口列表见附录2
    //   // });
    // }
}

/**
 * 清空缓存数据
 */
export function removeCacheExceptUserInfo() {
    Taro.removeStorageSync('store_article_category_list');
    Taro.removeStorageSync('store_home_data');
    Taro.removeStorageSync('store_record_list');
    Taro.removeStorageSync('store_fortune_records');
    Taro.removeStorageSync('store_fortune_selected_record');
    Taro.removeStorageSync('store_cat_list');
}

/**
 * 清空缓存数据
 */
export function removeCache() {
    Taro.removeStorageSync('access_token');
    Taro.removeStorageSync('id');
    Taro.removeStorageSync('has_self_recode');
    Taro.removeStorageSync('uc_id');
    Taro.removeStorageSync('mobile');
    Taro.removeStorageSync('open_id');

    removeCacheExceptUserInfo();
}

/**
 * 跳转到常量页面
 * @param page
 */
export function goToCommonPage(page, params) {

    //     'astrolable(星盘)',
    //       'composite(合盘)',
    //       'rectification(生时校正)',
    //       'divination(占卜)',
    //       'predict(预测)',
    //       'article_conversations(星座私房话---废弃)',
    //       'article_treasury(开运宝典---废弃)',
    //       'archives(档案管理)',
    //       'article_details?id=13(文章详情,调用之前的details接口)',
    //       'rectification_details?id=13(生时校正结果详情,调用之前的details接口)'，
    // 'lucky_star_details?id=11(幸运星提问详情)',
    //   'order_details?id=10(订单详情)',
    //   'vip(开通会员)',
    //   'day?rid=参数&time=2018-11-3(日运，无参数rid使用默认时间是当前时间)',
    //   'week(周运)',
    //   'month(周运_月运)',
    //   'year(周运_年运)',
    //   'fortune_for_month?rid=参数&time=2018-11(月运，无参数rid使用默认时间是当前时间)',
    //   'fortune_for_year?rid=参数&time=2018(年运，无参数rid使用默认时间是当前时间)',
    //   'empty(空)',
    //   'acg_map?rid=参数(地图首页)',
    //   'identify_love(鉴爱首页)'，
    // 'identify_result?rid1=参数&rid2=参数&wid1=参数&wid2=参数',（鉴爱结果页面）
    // 'pay_orders_for_year'(年运支付页面)
    //     'course_list'(课程广场)
    //     'my_course'(我的课程)
    //     'course_detail?id=参数' ]

    if (page.indexOf('?') != -1) {
        //console.log('page 参数包含\'?\'，那么进行处理 page=' + page);
        let link = page;
        page = link.split('?')[0];
        params = '?' + link.split('?')[1];
        //console.log('page=' + page + ',params=' + params);
    }
    if (!params) {
        params = '?';
    }
    //console.log('page=' + page);
    let url = '';
    if (page == PAGES.PAGE_URL) { //跳转url
        window.location.href = params;
    } else if (page == PAGES.PAGE_BALANCE_LIST) {
        url = '/pages/commonList/index?type=' + LIST_ITEM_TYPES.ITEM_BALANCE;
    } else if (page == PAGES.PAGE_QUESTION_DETAIL) {
        url = '/pages/platform/questionDetail/index' + params
    } else if (page == PAGES.PAGE_QUESTION_INPUT) {
        url = '/pages/platform/questionInput/index' + params
    } else if (page == PAGES.PAGE_QUESTION) {
        url = '/pages/commonList/index?type=' + LIST_ITEM_TYPES.ITEM_QUESITON;
    } else if (page == PAGES.PAGE_QUESTION_MY) {
        url = '/pages/commonList/index?type=' + LIST_ITEM_TYPES.ITEM_QUESITON_MY;
    } else if (page == PAGES.PAGE_ASTROLOGERS) {
        url = '/pages/commonList/index?type=' + LIST_ITEM_TYPES.ITEM_ASTROLOGER;
    } else if (page == PAGES.PAGE_ASTROLOGER_DETAIL) {
        url = '/pages/platform/astrologerDetail/index' + params
    } else if (page == PAGES.PAGE_ASTROLOGERS_SELECT) {
        url = '/pages/commonList/index?type=' + LIST_ITEM_TYPES.ITEM_ASTROLOGER + '&is_show_selected=1';
    } else if (page == PAGES.PAGE_IDENTIFY_LOVE) { //鉴爱
        url = '/pages/commonList/index?type=' + LIST_ITEM_TYPES.ITEM_IDENTIFY_LOVE;
    } else if (page == PAGES.PAGE_COMPOSITE) { //合盘
        url = '/pages/synastry/synastryList/index' + params;
    } else if (page == PAGES.PAGE_RECTIFICATION) { //生时校正
        url = '/pages/rectification/inputPage/index';
    } else if (page == PAGES.PAGE_RECTIFICATION_DETAILS) { //生时校正结果
        url = '/pages/rectification/resultDetail/index' + params;
    } else if (page == PAGES.PAGE_DIVINATION) { //占卜
        url = '/pages/divination/divinationInput/index';
    } else if (page == PAGES.PAGE_IDENTIFY_RESULT) { //鉴爱结果页
        url = '/pages/loveResult/index' + params;
    } else if (page == PAGES.PAGE_FORTUNE_FOR_YEAR) {
        // 0：日运；1：月运；2：年运；
        url = '/pages/fortune/fortuneDetail/index' + params + '&tab=2';
    } else if (page == PAGES.PAGE_FORTUNE_FOR_MONTH) {
        // 0：日运；1：月运；2：年运；
        url = '/pages/fortune/fortuneDetail/index' + params + '&tab=1';
    } else if (page == PAGES.PAGE_DAY) {
        // 0：日运；1：月运；2：年运；
        url = '/pages/fortune/fortuneDetail/index' + params + '&tab=0';
    } else if (page == PAGES.PAGE_ASTROLABLE) {
        url = '/pages/astro/detail/index' + params;
    } else if (page == PAGES.PAGE_PREDICT) {
        url = '/pages/astro/predict/index' + params;
    } else if (page == PAGES.PAGE_ORDER_DETAILS) {
        url = '/pages/order/Detail/index' + params;
    } else if (page == PAGES.PAGE_COURSE_LIST) {
        url = '/pages/commonList/index?type=' + LIST_ITEM_TYPES.ITEM_COURSE_LIST;
    } else if (page == PAGES.PAGE_COURSE_DETAIL) {
        url = '/pages/course/courseDetail/index' + params;
    } else if (page == PAGES.PAGE_ACG_MAP) { //'acg_map?rid=参数(地图首页)',
        if (params == '?') {
            params = getSelfRecord().id;
        }
        const header_obj = {
            'sign': sign,
            'access_token': Taro.getStorageSync('access_token'),
            'app_type': app_type,
            'did': did,
            'version': version,
            'time': time,
            'model': model,
            'phone_version': phone_version,
        }
        let str = 'uid=' + Taro.getStorageSync('id') + '&rid=' + params + '&domain_url=' + encodeURIComponent(domainUrl) + '&header=' + encodeURIComponent(JSON.stringify(header_obj)).replace(/\+/g, '%2B');
        // //console.log('encrypt str=' + str);
        let token = Encrypt(str);
        // //console.log('token=' + token);
        // str = Decrypt(token);
        window.location.href = baseUrl + '/web/acg/wap?token=' + token;
    }

    //下面是我自己定的
    else if (page == PAGES.PAGE_HOROSCOPE) { //八字
        url = '/pages/astro/horoscope/index' + params;
    } else if (page == PAGES.PAGE_RECORD_SELECT) { //档案选择页面
        url = '/pages/record/recordSelect/index' + params;
    } else if (page == PAGES.PAGE_CAT_RECORDS) {
        url = '/pages/record/catRecords/index' + params;
    } else if (page == PAGES.PAGE_RECORD_ADD) {
        url = '/pages/record/recordAdd/index' + params;
    }

    if (url)
        Taro.navigateTo({ url: url });
}

/**
 * 获取当前时间星期几
 */

export function getCurrenWeek(timestamp) {

    var myDate = new Date(timestamp * 1000);
    var days = myDate.getDay();
    switch (days) {
        case 1:
            days = '星期一';
            break;
        case 2:
            days = '星期二';
            break;
        case 3:
            days = '星期三';
            break;
        case 4:
            days = '星期四';
            break;
        case 5:
            days = '星期五';
            break;
        case 6:
            days = '星期六';
            break;
        case 0:
            days = '星期日';
            break;
    }
    return days == null ? "" : days;
}