import Taro from '@tarojs/taro'
import BaseComponent from "../BaseComponent";
import PropTypes from 'prop-types';
import { LIST_ITEM_TYPES } from "../../utils/constants";

import ItemArticle from './ItemArticle';
import { View } from '@tarojs/components';


class ItemList extends BaseComponent {

  static propTypes = {
    type: PropTypes.number,
    item: PropTypes.object,
    index: PropTypes.number,

    is_show_selected: PropTypes.number,//是否显示选中框，0：不显示；1：显示；
    is_selected: PropTypes.number,
    onItemClick: PropTypes.func,//选中按钮被点击
    // onItemMoreClick: PropTypes.func,//更多按钮被点击
  }

  static defaultProps = {
    type: 0,
    item: {},
  }

  componentWillMount() {
  }

  onItemClick = (index, type) => {
    this.log('ItemList onItemClick index=' + index + ',type=' + type);
    this.props.onItemClick(index, type);
  }

  render() {
    const { is_selected, item, index, type, is_show_selected, onItemMoreClick } = this.props
    // this.log('ItemList render index=' + index);
    switch (Number(type)) {

      case LIST_ITEM_TYPES.ITEM_ARTICLE: {
        return (
          <ItemArticle
            item={item}
            index={index}
          />
        )
      }
      case LIST_ITEM_TYPES.ITEM_LUCKY: {
        return (
          <ItemLucky
            item={item}
            index={index}
          />
        )
      }
      case LIST_ITEM_TYPES.ITEM_DIVINATION: {
        return (
          <ItemDivination
            item={item}
            index={index}
          />
        )
      }
      case LIST_ITEM_TYPES.ITEM_FORTUNE_NOTE: {
        return (
          <ItemFortuneNote
            item={item}
            index={index}
          />
        )
      }
      case LIST_ITEM_TYPES.ITEM_ZAN: {
        return (
          <ItemArticle
            item={item}
            index={index}
          />
        )
      }

      case LIST_ITEM_TYPES.ITEM_COLLECT: {
        return (
          <ItemArticle
            item={item}
            index={index}
          />
        )
      }

      case LIST_ITEM_TYPES.ITEM_COLLECT: {
        return (
          <ItemMapCollect
            item={item}
            index={index}
            onItemClick={this.onItemClick}
            is_show_selected={is_show_selected}
            is_selected={is_selected}
          />
        )
      }

      case LIST_ITEM_TYPES.ITEM_ORDER: {
        return (
          <ItemOrder
            item={item}
            index={index}
            onItemMoreClick={onItemMoreClick}
            onItemClick={this.onItemClick}
            is_show_selected={is_show_selected}
          />
        )
      }

      case LIST_ITEM_TYPES.ITEM_RECTIFICATION: {
        return (
          <ItemRectification
            item={item}
            index={index}
            onItemMoreClick={onItemMoreClick}
            onItemClick={this.onItemClick}
            is_show_selected={is_show_selected}
          />
        )
      }

      case LIST_ITEM_TYPES.ITEM_MESSAGE_SERVICE: {
        return (
          <ItemMessage
            item={item}
            index={index}
            onItemMoreClick={onItemMoreClick}
            onItemClick={this.onItemClick}
            is_show_selected={is_show_selected}
          />
        )
      }

      case LIST_ITEM_TYPES.ITEM_MESSAGE_SYSTEM: {
        return (
          <ItemMessage
            item={item}
            index={index}
            onItemMoreClick={onItemMoreClick}
            onItemClick={this.onItemClick}
            is_show_selected={is_show_selected}
          />
        )
      }

      case LIST_ITEM_TYPES.ITEM_COMMENT_REPLY_ME: {
        return (
          <ItemReplay
            item={item}
            index={index}
            onItemMoreClick={onItemMoreClick}
            onItemClick={this.onItemClick}
            is_show_selected={is_show_selected}
          />
        )
      }

      case LIST_ITEM_TYPES.ITEM_IDENTIFY_LOVE: {
        return (
          <ItemIdentifyLove
            item={item}
            index={index}
            onItemMoreClick={onItemMoreClick}
            onItemClick={this.onItemClick}
            is_show_selected={is_show_selected}
          />
        )
      }

      case LIST_ITEM_TYPES.ITEM_LOVE_WECHAT_RECORD: {
        return (
          <ItemLoveWechatRecord
            item={item}
            index={index}
            onItemMoreClick={onItemMoreClick}
            onItemClick={this.onItemClick}
            is_show_selected={is_show_selected}
          />
        )
      }

      case LIST_ITEM_TYPES.ITEM_DIVINATION_NOTE: {
        return (
          <ItemAstroOrDivinationNote
            type={type}
            item={item}
            index={index}
            onItemMoreClick={onItemMoreClick}
            onItemClick={this.onItemClick}
            is_show_selected={is_show_selected}
          />
        )
      }

      case LIST_ITEM_TYPES.ITEM_ASTRO_NOTE: {
        return (
          <ItemAstroOrDivinationNote
            type={type}
            item={item}
            index={index}
            onItemMoreClick={onItemMoreClick}
            onItemClick={this.onItemClick}
            is_show_selected={is_show_selected}
          />
        )
      }

      case LIST_ITEM_TYPES.ITEM_COURSE_LIST: {
        return (
          <ItemCourse
            type={type}
            item={item}
            index={index}
            onItemMoreClick={onItemMoreClick}
            onItemClick={this.onItemClick}
            is_show_selected={is_show_selected}
          />
        )
      }

      case LIST_ITEM_TYPES.ITEM_MY_COURSE: {
        return (
          <ItemCourse
            type={type}
            item={item}
            index={index}
            onItemMoreClick={onItemMoreClick}
            onItemClick={this.onItemClick}
            is_show_selected={is_show_selected}
          />
        )
      }

      case LIST_ITEM_TYPES.ITEM_ASTROLOGER: {
        return (
          <ItemAstrologer
            type={type}
            item={item}
            index={index}
            onItemMoreClick={onItemMoreClick}
            onItemClick={this.onItemClick}
            is_show_selected={is_show_selected}
          />
        )
      }

      case LIST_ITEM_TYPES.ITEM_QUESITON_MY: {
        return (
          <ItemQuestion
            type={type}
            item={item}
            index={index}
            onItemMoreClick={onItemMoreClick}
            onItemClick={this.onItemClick}
            is_show_selected={is_show_selected}
          />
        )
      }

      case LIST_ITEM_TYPES.ITEM_QUESITON: {
        return (
          <ItemQuestion
            type={QUESTION_ITEM_TYPE.QUESTION_TAB_LIST}
            item={item}
            index={index}
            onItemMoreClick={onItemMoreClick}
            onItemClick={this.onItemClick}
            is_show_selected={is_show_selected}
          />
        )
      }

      case LIST_ITEM_TYPES.ITEM_BALANCE: {
        return (
          <ItemBalance
            type={type}
            item={item}
            index={index}
            onItemMoreClick={onItemMoreClick}
            onItemClick={this.onItemClick}
            is_show_selected={is_show_selected}
          />
        )
      }


    }
  }
}

export default ItemList;
