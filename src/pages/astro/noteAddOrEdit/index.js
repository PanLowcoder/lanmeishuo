import Taro from '@tarojs/taro';
import BaseComponent from "../../../components/BaseComponent";
import {View} from '@tarojs/components';
import {connect} from '@tarojs/redux';
import './index.scss';
import {AtNavBar, AtTextarea} from "taro-ui";
import {showToast} from '../../../utils/common'
import {add_astro_note, add_divination_note, edit_astro_note, edit_divination_note} from "../service";
import {EVENT_COMMON_LIST_ADD, EVENT_COMMON_LIST_UPDATE} from "../../../utils/constants";

export const NOTE_PAGE_TYPE = {
  ASTRO: 0,//星盘笔记
  DIVINATION: 1,//占卜笔记
}

export const NOTE_TYPE = {
  DELETE: -1,//删除
  EDIT: 0,//编辑
  ADD: 1,//添加
}

@connect(({astro}) => ({
  ...astro
}))
class noteAddOrEdit extends BaseComponent {
  config = {
    navigationBarTitleText: '备注',
  }

  constructor() {
    super(...arguments)
    this.state = {
      page_type: NOTE_PAGE_TYPE.ASTRO,//NOTE_PAGE_TYPE
      type: NOTE_TYPE.ADD,//NOTE_TYPE 类型：0：新建；1：编辑；
      nav_right_text: '',//右侧按钮的文字
      content: '',//输入的备注内容
      rid: '',//rid 占卜为did
      from: '',//来源于哪个盘
      edit_id: '',//编辑id
      event_time: '',//时间
      did: '',//did 占卜需要用到
    }
  }

  componentDidUpdate = () => {
  }

  componentDidMount = () => {
    let page_type = this.$router.params.page_type
    if (page_type)
      this.setState({page_type})

    let type = this.$router.params.type
    if (type)
      this.setState({type})

    let rid = this.$router.params.rid
    if (rid)
      this.setState({rid})

    let from = this.$router.params.from
    if (from)
      this.setState({from})

    let content = this.$router.params.content
    if (content)
      this.setState({content})

    let edit_id = this.$router.params.id
    if (edit_id)
      this.setState({edit_id})

    let event_time = this.$router.params.event_time
    if (event_time)
      this.setState({event_time})

  }

  componentDidHide = () => {

  }

  componentWillReceiveProps = () => {

  }

  //事件输入框失去焦点时触发
  handleInputChange(event) {
    this.setState({content: event.target.value})
    this.log('handleInputChange text=' + event.target.value + ',note_content=' + this.state.content)
    if (NOTE_TYPE.ADD == this.state.type) {//新建
      if (event.target.value.length > 0) {//数量大于0，那么设置显示完成按钮
        this.setState({nav_right_text: '完成'})
      } else {
        this.setState({nav_right_text: ''})
      }
    } else {//编辑
      if (event.target.value == this.state.content) {//内容没有变化，那么不显示完成按钮
        this.setState({nav_right_text: ''})
      } else {
        this.setState({nav_right_text: '完成'})
      }
    }
  }


  //提交按钮 被点击
  actionNavRightBtnClick = () => {
    this.log('actionNavRightBtnClick content=' + this.state.content)
    if (this.state.content.length == 0) {//内容不能为空
      showToast('内容不能为空')
      return;
    }


    if (NOTE_PAGE_TYPE.ASTRO == this.state.page_type) {//星盘页面
      if (NOTE_TYPE.ADD == this.state.type) {
        this.requestAddNote(NOTE_PAGE_TYPE.ASTRO, this.state.rid, this.state.from, this.state.content, this.state.event_time)
      } else {
        this.requestEditNote(NOTE_PAGE_TYPE.ASTRO, this.state.rid, this.state.edit_id, this.state.content)
      }
    } else {//占卜页面
      if (NOTE_TYPE.ADD == this.state.type) {
        this.requestAddNote(NOTE_PAGE_TYPE.DIVINATION, this.state.rid, this.state.from, this.state.content, '')
      } else {
        this.requestEditNote(NOTE_PAGE_TYPE.DIVINATION, this.state.rid, this.state.edit_id, this.state.content)
      }
    }

  }

  render() {

    const {nav_right_text, content} = this.state;

    return (
      <View className='note-page'>

        {/*导航栏*/}
        <AtNavBar
          className='nav'
          onClickLeftIcon={this.actionNavBack}
          color='#000'
          title='备注'
          leftIconType='chevron-left'
          fixed
        />
        {nav_right_text && (
          <View
            className='nav-right-btn'
            onClick={this.actionNavRightBtnClick}
          >
            {nav_right_text}
          </View>
        )}

        <View className='content-con'>
          <View className='input-con'>
            <AtTextarea
              className='input-detail'
              value={content}
              border={false}
              // onBlur={this.actionInputBlur.bind(this)}
              onChange={this.handleInputChange.bind(this)}
              maxLength={300}
              placeholder='您可以点击此处添加备注（300字以内）~'
            />
          </View>

        </View>
      </View>
    )
  }

  /**
   * 网络请求- 新增星盘/占卜备注
   * @param type
   * @param rid
   * @param from
   * @param content
   * @returns {Promise<void>}
   */
  async requestAddNote(type, rid, from, content, event_time) {
    let res = {}
    if (NOTE_PAGE_TYPE.ASTRO == type) {
      res = await add_astro_note({rid, from, content, event_time})
    } else
      res = await add_divination_note({did: rid, content})

    if (res.code == '200') {
      //发送消息，更新list ui
      Taro.eventCenter.trigger(EVENT_COMMON_LIST_ADD);
      showToast(res.msg)
      Taro.navigateBack()
    }
  }

  /**
   * 网络请求-编辑星盘/占卜备注
   * @param type
   * @param rid
   * @param id
   * @param content
   * @returns {Promise<void>}
   */
  async requestEditNote(type, rid, id, content) {
    let res = {}
    if (NOTE_PAGE_TYPE.ASTRO == type)
      res = await edit_astro_note({rid, id, content})
    else
      res = await edit_divination_note({did: rid, id, content})

    if (res.code == '200') {
      //发送消息，更新list ui
      Taro.eventCenter.trigger(EVENT_COMMON_LIST_UPDATE);
      showToast(res.msg)
      Taro.navigateBack()
    }
  }

}

export default noteAddOrEdit;
