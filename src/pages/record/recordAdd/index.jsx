import Taro from '@tarojs/taro';
import BaseComponent from "../../../components/BaseComponent";
import { View, Text, Image, Picker } from '@tarojs/components';
import { connect } from '@tarojs/redux';
import './index.scss';
import ItemRecordAdd from '../../../components/Item/ItemRecordAdd';
import RecordAddSexModal from '../../../components/Modal/RecordAddSexModal'
import { ossUrl } from "../../../config";
// import {record_upload_img} from "../../../pages/map/service";
import { getRecord, isEmpty, showToast } from "../../../utils/common";
import { cityData_latlng } from "../../../js/city.data-xzns.js";

const img_back = ossUrl + 'upload/images/article/left_arrow.png'
const img_edit = ossUrl + 'wap/images/record/img_edit.png'
const img_default_avatar = ossUrl + 'wap/images/common/img_default_avatar.png'
const img_sex = ossUrl + "wap/images/record/img_sex.png";
const img_date = ossUrl + "wap/images/record/img_date.png";
const img_address_birth = ossUrl + "wap/images/record/img_address_birth.png";
const img_address_current = ossUrl + "wap/images/record/img_address_current.png";

// const cityData_latlng = ossUrl + "wap/utils/city.data-xzns.js";

@connect(({ record }) => ({
  ...record,
}))
class recordAdd extends BaseComponent {
  config = {
    navigationBarTitleText: '新建档案',
  };

  constructor() {
    super(...arguments)
    this.state = {
      type: 0,//类型：0：新增；1：编辑；2：新增自己的档案；
      cities: JSON.parse(JSON.stringify(cityData_latlng)),
      is_show_sex_modal: false,
      index_of_click: -1,
      picker_birth_citys: [[], [], []],
      picker_live_citys: [[], [], []],
      record_add_sex_list: [
        {
          name: '男',
          sex: 1,
        },
        {
          name: '女',
          sex: 2,
        },
        {
          name: '事件',
          sex: 5,
        }
      ],//性别model list内容
      record_add_list: [
        {
          img: img_sex,
          name: '性别 | 类别',
          value: '',
          value_name: '',
          is_show: false,
        },
        {
          img: img_date,
          name: '出生日期',
          value: '',
          value_name: '',
        },
        {
          img: img_date,
          name: '出生时间',
          value: '',
          value_name: '',
        },
        {
          img: img_date,
          name: '出生时区',
          value: '',
          value_name: '',
        },
        {
          img: img_address_birth,
          name: '出生地点',
          value: '',
          value_name: '',
        },
        {
          img: img_address_current,
          name: '现居地',
          value: '',
          value_name: '',
        }
      ],

      files: []

    }
  }

  //TODO 网络下载城市数据，然后解析
  async requestDetail() {
    const res = await get_citys({});
    if (res.code == '200') {
      this.log(res)
    }
  }

  componentDidMount = () => {

    // 初始化出生地点和现居地picker数据
    let type = this.$router.params.type;
    let rid = this.$router.params.rid;
    this.setState({
      type: type
    });

    let record_add_list = this.state.record_add_list;
    if (type == 1) {//编辑档案，开始赋值
      let record = getRecord(rid);
      this.log(record);

      //性别
      this.state.record_add_sex_list.forEach(item => {
        if (item.sex == record.type) {
          record_add_list[0].value = record.type;
          record_add_list[0].value_name = item.name;
        }
      });
      //出生日期
      record_add_list[1].value_name = record.year + '-' + record.month + '-' + record.day;
      //出生时间
      record_add_list[2].value_name = record.hour + ':' + record.minute;
      //出生时区
      record_add_list[3].value_name = this.getTimeZone(record.timezone);
      record_add_list[3].value = Number(record.timezone) + 12;
      //出生地点
      record_add_list[4].value_name = record.birth_country + record.birth_province + record.birth_city;
      record_add_list[4].value = this.getPickerAddressIndexArr([record.birth_country, record.birth_province, record.birth_city]);
      //现居地
      record_add_list[5].value_name = record.live_country + record.live_province + record.live_city;
      record_add_list[5].value = this.getPickerAddressIndexArr([record.live_country, record.live_province, record.live_city]);

      this.props.dispatch({
        type: 'record/save',
        payload: {
          record_add_params: record,
          record_add_name: record.name,
          record_add_tag: record.comments,
          record_add_avatar: record.avatar,
        }
      });
    } else {//新增
      record_add_list[4].value = [0, 0, 0];
      record_add_list[5].value = [0, 0, 0];
    }

    this.setState({
      record_add_list: record_add_list,
      picker_birth_citys: this.getPickerAddressArr(record_add_list[4].value),
      picker_live_citys: this.getPickerAddressArr(record_add_list[5].value),
    });
  }

  // picker选择数据动态渲染
  onColumnchange = e => {
    const { column, value } = e.detail;
    this.log('onColumnchange column =' + column + ',value=' + value);
    if (this.state.index_of_click == 4) {
      this.setState({
        picker_birth_citys: this.getPickerAddressArr([value, column, 0]),
      });
    } else {
      this.setState({
        picker_live_citys: this.getPickerAddressArr([value, column, 0]),
      });
    }

  };

  //关闭按钮
  actionBack = () => {
    Taro.navigateBack();
  }

  //保存按钮
  actionSave = () => {
    this.log('actionSave');
    if (this.props.record_add_name == '') {
      showToast('未填写姓名！')
      return false;
    }
    if (this.state.record_add_list[0].value_name == '') {
      showToast('未填写性别或类别！')
      return false;
    }
    if (this.state.record_add_list[1].value_name == '') {
      showToast('未填写出生日期！')
      return false;
    }
    if (this.state.record_add_list[2].value_name == '') {
      showToast('未填写出生时间！')
      return false;
    }
    if (this.state.record_add_list[3].value_name == '') {
      showToast('未填写出生时区！')
      return false;
    }
    if (this.state.record_add_list[4].value_name == '') {
      showToast('未填写出生地点！')
      return false;
    }
    if (this.state.record_add_list[5].value_name == '') {
      showToast('未填写现居地！')
      return false;
    }
    let params = this.props.record_add_params;
    params.name = this.props.record_add_name;
    params.comments = this.props.record_add_tag;
    params.avatar = this.props.record_add_avatar

    if (this.state.type == 2) {//新增自己，那么设置参数
      params.isself = 1;
    }

    //保存列表数据
    this.props.dispatch({
      type: 'record/save',
      payload: {
        record_add_params: params,
      },
    });

    //请求数据，保存档案
    if (this.state.type == 0 || this.state.type == 2) {
      this.props.dispatch({
        type: 'record/record_add',
      });
    } else {
      this.props.dispatch({
        type: 'record/record_edit',
      });
    }

  }

  //编辑姓名 点击事件
  actionNameEdit = () => {
    Taro.navigateTo({
      url: '/pages/record/recordNameAndTagAdd/index?type=' + this.state.type,
    });
  }

  //头像点击事件
  actionAvatar = () => {
    this.log('actionAvatar');
    let self = this;
    Taro.chooseImage({
      count: 1,
      sizeType: ['compressed'],
      sourceType: ['camera'],
      success: function (res) {
        let value = res && res.tempFiles[0];

        //网路请求，上传图片
        self.requestUploadImg('/api/v10/img/upload?type=1', value, function (result) {
          console.log('chooseImage')
          console.log(result)
          if (result.code == '200') {
            showToast(result.msg)
            //上传成功，替换图片
            self.props.dispatch({
              type: 'record/save',
              payload: {
                record_add_avatar: result.data.path
              }
            })
          } else {
            if (result.msg)
              showToast(result.msg)
          }

        })
      }
    })
  }

  //item被点击
  onItemClick = (index) => {
    this.log('onItemClick index=' + index);

    this.setState(
      {
        is_show_sex_modal: index == 0 ? true : false,
        index_of_click: index,
      }
    );
  }

  //性别model里的item点击
  onSexItemClick = (index) => {
    this.log('onSexItemClick index=' + index);
    let sex_item = this.state.record_add_sex_list[index];
    let list = this.state.record_add_list;
    list[0].value = sex_item.sex;
    list[0].value_name = sex_item.name;

    this.setState({ is_show_sex_modal: false, record_add_list: list });
    let params = this.props.record_add_params;
    params.type = sex_item.sex;
    this.props.dispatch({
      type: 'record/save',
      payload: {
        record_add_params: params,
      }
    });
  }

  //picker改变事件
  onPickerChange = (e) => {
    this.log('onPickerChange value=' + e.detail.value + ',index=' + this.state.index_of_click);

    let list = this.state.record_add_list;
    let params = this.props.record_add_params;
    switch (Number(this.state.index_of_click)) {
      case 1: {
        list[this.state.index_of_click].value_name = e.detail.value;
        params.year = e.detail.value.split('-')[0];
        params.month = e.detail.value.split('-')[1];
        params.day = e.detail.value.split('-')[2];
        break;
      }
      case 2: {
        list[this.state.index_of_click].value_name = e.detail.value;
        params.hour = e.detail.value.split(':')[0];
        params.minute = e.detail.value.split(':')[1];
        break;
      }
      case 3: {
        let value_name = Number(e.detail.value) - 12;
        params.timezone = value_name;
        value_name = this.getTimeZone(value_name);
        this.log('时区为' + value_name);
        list[this.state.index_of_click].value_name = value_name;
        break;
      }
      case 4: {
        const cities = this.state.cities;
        let province = cities[e.detail.value[0]];
        let city = cities[e.detail.value[0]].children[e.detail.value[1]];
        let district = cities[e.detail.value[0]].children[e.detail.value[1]].children[e.detail.value[2]];
        list[this.state.index_of_click].value_name = province.text + city.text + district.text;
        params.birth_country = province.text;
        params.birth_province = city.text;
        params.birth_city = district.text;
        params.lat_deg = district.lat_deg;
        params.lat_min = district.lat_min;
        params.long_deg = district.long_deg;
        params.long_min = district.long_min;
        params.ew = district.ew;
        params.ns = district.ns;
        let record_add_list = this.state.record_add_list;
        record_add_list[4].value = e.detail.value;
        this.setState({ record_add_list: this.state.record_add_list });
        break;
      }
      case 5: {
        const cities = this.state.cities;
        let province = cities[e.detail.value[0]];
        let city = cities[e.detail.value[0]].children[e.detail.value[1]];
        let district = cities[e.detail.value[0]].children[e.detail.value[1]].children[e.detail.value[2]];
        this.log(province.text);
        this.log(city.text);
        this.log(district.text);
        list[this.state.index_of_click].value_name = province.text + city.text + district.text;

        params.live_country = province.text;
        params.live_province = city.text;
        params.live_city = district.text;
        let record_add_list = this.state.record_add_list;
        record_add_list[5].value = e.detail.value;
        this.setState({ record_add_list: record_add_list });
        break;
      }
    }
    //保存列表数据
    this.props.dispatch({
      type: 'record/save',
      payload: {
        record_add_list: list,
        record_add_params: params,
      },
    });

    // 修复bug不能及时刷新选择
    this.onItemClick();

  }

  onAvatarChange(files) {
    this.setState({
      files
    })
    this.log('onAvatarChange')
    this.log(files);


    this.requestRemarkName(files[0].file.path);

  }

  async requestRemarkName(path) {
    let formData = new FormData();
    // for (var key in params) {
    //   formData.append(key, params[key]);
    // }
    let file = { uri: path, type: 'image/png', name: 'image.png' };
    formData.append("file", path);
    this.log(formData)
    let res = await record_upload_img({
      avatar: file
    });
    if (res.code == '200') {
      showToast(res.msg);
    }
  }

  render() {
    const {
      is_show_sex_modal,
      record_add_sex_list,
      record_add_list,
      picker_birth_citys,
      picker_live_citys,
    } = this.state;
    const {
      record_add_name,
      record_add_tag,
      record_add_avatar,
    } = this.props;

    let time_zones = [];
    for (let i = -12; i < 12; i++) {
      time_zones.push('GMT' + i);
    }


    return (
      <View className='record-cat-page'>
        {/*关闭按钮*/}
        <View className='top_container'>
          <View
            className='close_container'
            onClick={this.actionBack}
          >
            <Image
              className='close_img'
              src={img_back}
            />
          </View>
          <View
            className='save'
            onClick={this.actionSave}
          >保存</View>
          <View className='title'>
            添加出生信息
          </View>
          <View className='hint'>时区默认为中国时区，夏令时自动判断</View>

          {/*名字性别部分*/}
          <View className='name-con'>
            <View className='left-con' onClick={this.actionNameEdit}>
              <Text className='name'>{record_add_name == '' ? '姓名' : record_add_name}</Text>
              <Image
                className='img_name_edit'
                src={img_edit}
              />
              <View className='tag'>{record_add_tag == '' ? '标签' : record_add_tag}</View>
            </View>
            <Image
              className='avatar'
              src={isEmpty(record_add_avatar) ? img_default_avatar : (ossUrl + record_add_avatar)}
              onClick={this.actionAvatar}
            />

          </View>

          <View className='bottom_list'>
            {
              record_add_list.map((item, index) => (
                <View>
                  {/*性别*/}
                  {index == 0 && (
                    <ItemRecordAdd
                      index={index}
                      item={item}
                      onItemClick={this.onItemClick}
                    />
                  )}
                  {/*出生日期*/}
                  {index == 1 && (
                    <Picker
                      mode='date'
                      start='1900-01-01'
                      end='2049-12-31'
                      value={item.value_name}
                      onChange={this.onPickerChange}
                    >
                      <ItemRecordAdd
                        index={index}
                        item={item}
                        onItemClick={this.onItemClick}
                      />
                    </Picker>
                  )}

                  {/*出生时间*/}
                  {index == 2 && (
                    <Picker
                      mode='time'
                      value={item.value_name}
                      onChange={this.onPickerChange}
                    >
                      <ItemRecordAdd
                        index={index}
                        item={item}
                        onItemClick={this.onItemClick}
                      />
                    </Picker>
                  )}

                  {/*时区*/}
                  {index == 3 && (
                    <Picker
                      mode='selector'
                      range={time_zones}
                      value={item.value}
                      onChange={this.onPickerChange}
                    >
                      <ItemRecordAdd
                        index={index}
                        item={item}
                        onItemClick={this.onItemClick}
                      />
                    </Picker>
                  )}

                  {/*出生地点和现居地*/}
                  {(index == 4 || index == 5) && (
                    <Picker
                      className='picker'
                      mode='multiSelector'
                      rangeKey='name'
                      range={index == 4 ? picker_birth_citys : picker_live_citys}
                      value={item.value}
                      onColumnchange={this.onColumnchange}
                      onChange={this.onPickerChange}
                    >
                      <ItemRecordAdd
                        index={index}
                        item={item}
                        onItemClick={this.onItemClick}
                      />
                    </Picker>
                  )}


                </View>
              ))}
          </View>
        </View>

        {/*性别 弹出框*/}
        <RecordAddSexModal
          show={is_show_sex_modal}
          record_add_sex_list={record_add_sex_list}
          sex={record_add_list[0].value}
          onSexItemClick={this.onSexItemClick}
        />


      </View>
    )
  }

  /**
   * 获取时区
   * @param value_name
   * @returns {string}
   */
  getTimeZone(value_name) {
    if (value_name < 0) {
      value_name = '西' + Math.abs(value_name) + '区';
    } else {
      value_name = '东' + Math.abs(value_name) + '区';
    }
    return value_name;
  }

  /**
   * 根据 array_index 获取数据
   * @param arr_index
   */
  getPickerAddressArr(arr_index = [0, 0, 0]) {
    const arr = [[], [], []];
    this.state.cities.forEach(item => {
      arr[0].push({
        key: item.key,
        name: item.text,
      });
    });
    this.state.cities[arr_index[0]].children.forEach(item => {
      arr[1].push({
        key: item.key,
        name: item.text,
      });
    });
    this.state.cities[arr_index[0]].children[arr_index[1]].children.forEach(item => {
      arr[2].push({
        key: item.key,
        name: item.text,
      });
    });
    this.log(arr_index);
    this.log(arr);

    return arr;
  }

  /**
   * 通过名称查询 index_arr
   * @param arr
   * @returns {Array}
   */
  getPickerAddressIndexArr(arr) {
    let arr_index = [];
    this.state.cities.forEach((item, index) => {
      if (arr[0] == item.text) {
        arr_index.push(index);
        item.children.forEach((item1, index1) => {
          if (arr[1] == item1.text) {
            arr_index.push(index1);
            item1.children.forEach((item2, index2) => {
              if (arr[2] == item2.text) {
                arr_index.push(index2);
              }
            })
          }
        })
      }
    })
    return arr_index;
  }
}

export default recordAdd;
