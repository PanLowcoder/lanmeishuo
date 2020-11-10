import Taro from '@tarojs/taro';
import BaseComponent from "../../../components/BaseComponent";
import {View, Text, ScrollView} from '@tarojs/components';
import {CONS, HOUSE, PHASE, PLANET} from '../../../utils/constants'
import { getNameFromRecord, getRecord, getSelfRecord} from "../../../utils/common";
import {connect} from '@tarojs/redux';
import './index.scss';
import {AtTabs, AtNavBar} from 'taro-ui';
import {getWindowHeight} from "../../../utils/style";

@connect(({astro}) => ({
  ...astro,
}))
class natalOrNowParamsDetail extends BaseComponent {
  config = {
    navigationBarTitleText: '自己',
  };

  constructor() {
    super(...arguments)
    this.state = {
      tabs: [
        {title: '基本参数'},
        {title: '古典参数'},
        {title: '结构参数'}
      ],
      tabsListValue: 0,//顶部tab栏，当前选中标识；
    }
  }

  componentDidUpdate = () => {
    //this.log('weekDetail componentDidUpdate ');
  }

  componentDidMount = () => {
    let rid = this.$router.params.rid;
    let record = {};
    if (!rid) {
      record = getSelfRecord();
    } else {
      record = getRecord(rid);
    }
    this.setState({record: record});

  };

  //点击tab栏
  handleTabsClick(stateName, value) {
    this.setState({
      [stateName]: value
    });
  }

  //点击list
  onClick() {
    //this.log(item)
  }

  render() {
    const {data, tid} = this.props;
    const {record, tabs, tabsListValue} = this.state;

    this.log('natalOrNowParamsDetail tabsListValue=' + tabsListValue)

    let phase_headers = [' '];
    let phase_temp = [];

    let influence = [];
    let planet_ancients = [];
    let planet_ancients_houtian = [];
    let fortunes = [];
    let hurong_and_jiena = [];
    let yingdian_and_fanyingdian = [];
    let according = [];
    let star = [];
    let dushu = [];

    let jiegou = [];
    let zhongdian = [];
    this.log(data)
    if (data && data.planets) {

      //处理行星数据
      let planets = [];
      if (process.env.TARO_ENV === 'h5') {
        for (let key in data.planets) {
          planets.push(data.planets[key]);
        }
        data.planets = planets;
      }


      // }

      //处理宫位数据
      if (process.env.TARO_ENV === 'h5') {
        let houses = [];
        for (let key in data.houses) {
          houses.push(data.houses[key]);
        }
        data.houses = houses;
      }

      //处理相位数据
      for (let i = 0; i <= 9; i++) {
        phase_headers.push(PLANET(i)['cn']);
      }
      phase_headers.push('升');
      phase_headers.push('顶');
      let phase = [];
      for (let h = 0; h < phase_headers.length; h++) {
        let item = [];
        for (let i = 0; i < data.phase.length; i++) {
          if (data.phase[i].id1 == h) {
            let value = data.phase[i].id2;
            if (value == 17) {
              value = 11;
            } else if (value == 20) {
              value = 12;
            }
            item.push(value + ',' + data.phase[i].phase_deg);
          }
        }
        phase.push(item)
      }
      for (let i = 0; i < phase.length; i++) {
        let item = phase[i];
        let item_temp = [];
        for (let h = 0; h < phase_headers.length; h++) {
          let item_value = ' ';
          for (let j = 0; j < item.length; j++) {
            let value = item[j].split(',');
            if (h == value[0]) {
              item_value = value[1];
            }
          }
          item_temp.push(item_value);
        }
        item_temp.unshift(phase_headers[i + 1]);

        phase_temp.push(item_temp);
      }
      // this.log(phase_temp)

      //处理力量分部数据
      influence = [
        [' ', '角宫', '续宫', '果宫'],
        ['整宫',
          data.influence['w']['angular'],
          data.influence['w']['continues'],
          data.influence['w']['angular'],
        ],
        ['象限',
          data.influence['p']['angular'],
          data.influence['p']['continues'],
          data.influence['p']['angular'],
        ],
      ];


      //处理先天尊贵数据
      planet_ancients = [
        ["星", "黄经", "本", "升", "三分", "十", "界", "弱", "陷", "分数"],

      ];
      for (let i = 0; i < data.planets.length; i++) {
        let item = [];
        let planet = data.planets[i];
        item.push(planet.id);
        item.push([planet.in_sign_id, planet.in_sign_deg]);
        item.push(planet.ancient.or_walls_planet_id);
        item.push(planet.ancient.or_promote_planet_id);
        item.push(planet.ancient.or_trisection_planet_id);
        item.push(planet.ancient.or_period_planet_id);
        item.push(planet.ancient.or_extent_planet_id);
        item.push(planet.ancient.or_walls_fall_planet_id);
        item.push(planet.ancient.or_promote_fall_planet_id);
        item.push(planet.ancient.power);
        planet_ancients.push(item);
      }

      //处理后天状态数据
      planet_ancients_houtian = [
        ["星", "黄经", "宫", ' ', ' ', ' ', ' '],

      ];
      for (let i = 0; i < data.planets.length; i++) {
        let item = [];
        let planet = data.planets[i];
        item.push(planet.id);
        item.push([planet.in_sign_id, planet.in_sign_deg]);
        item.push(planet.in_house_id),
          // 0 得时  1 失时 -1 不存在
          item.push(planet.ancient.or_promote_planet_id == -1 ? ' ' : (planet.ancient.or_promote_planet_id == 0 ? '得时' : '失时'));
        //0 东出  1 西入 -1 不存在
        item.push(planet.ancient.sun_in_out == -1 ? ' - ' : (planet.ancient.sun_in_out == 0 ? '东出' : '西入'));
        //0 无 1 在日光下 2 灼伤 3 日心 -1 不存在
        let sun_dist = '';
        if (planet.ancient.sun_dist == 1) {
          sun_dist = "在日光下";
        } else if (planet.ancient.sun_dist == 2) {
          sun_dist = "灼伤";
        } else if (planet.ancient.sun_dist == 3) {
          sun_dist = "日心";
        } else {
          sun_dist = "-";
        }
        item.push(sun_dist);
        // 0 不是喜乐宫  1 落在喜乐宫 -1 不存在
        item.push(planet.ancient.like_house == 1 ? '喜乐' : '-');
        planet_ancients_houtian.push(item);
      }
      if (process.env.TARO_ENV === 'h5') {
        //福点
        for (let key in data.fortune) {
          let item = []
          let value = data.fortune[key];
          switch (key) {
            case 'ecliptic': {
              item.push('黄道状态');
              item.push(value + '分')
              break;
            }
            case 'phase': {
              item.push('相位吉凶');
              item.push(value + '分')
              break;
            }
            case 'house': {
              item.push('宫位落点');
              item.push(value + '分')
              break;
            }
            case 'star': {
              item.push('恒星加持');
              item.push(value + '分')
              break;
            }
            case 'total': {
              item.push('总计得分');
              item.push(value + '分')
              break;
            }
          }
          fortunes.push(item);
        }
      }

      //互容接纳
      if (process.env.TARO_ENV === 'h5') {
        for (let key in data.characteristic) {

          let value = data.characteristic[key];
          for (let i = 0; i < value.length; i++) {
            let item = [];
            if (value[i]['status'] == 1) {//接纳
              item.push(1);
              item.push(value[i].id1);
              item.push('被');
              item.push(value[i].id2);
              item.push('(' + value[i].ancient2 + ')');
              item.push(value[i].relation);
              hurong_and_jiena.push(item);
            } else if (value[i]['status'] == 2) {//互容
              item.push(2);
              item.push(value[i].id1);
              item.push('(' + value[i].ancient1 + ')');
              item.push('与');
              item.push(value[i].id2);
              item.push('(' + value[i].ancient2 + ')');
              item.push(value[i].relation);
              hurong_and_jiena.push(item);
            } else if (value[i]['status'] == 6 || value[i]['status'] == 7) {//映点、反映点
              item.push(value[i].id1);
              item.push('与');
              item.push(value[i].id2);
              item.push(value[i].event);
              yingdian_and_fanyingdian.push(item);
            } else if (value[i]['status'] == 3 || value[i]['status'] == 4 || value[i]['status'] == 5 || value[i]['status'] == 8) {//特殊度数
              item.push(value[i].id1);
              item.push(value[i].event);
              dushu.push(item);
            }
          }
        }
      }

      //赤纬平行
      if (process.env.TARO_ENV === 'h5') {
        for (let key in data.according) {
          let value = data.according[key];
          for (let i = 0; i < value.length; i++) {
            let item = [];
            item.push(value[i][0]);
            item.push('与');
            item.push(value[i][1]);
            item.push(key == 'just' ? '纬照' : '反纬照');
            according.push(item);
          }
        }
      }

      //恒星会合
      for (let w = 0; w < data.star.length; w++) {
        let value = data.star[w];
        let item = [];
        item.push(value.name);
        item.push(value.in_sign - 1);
        item.push(value.in_sign_deg);
        item.push('与');
        item.push(value.con_planet_id);
        item.push('合相');
        star.push(item);
      }

      //行星结构
      if (process.env.TARO_ENV === 'h5') {
        for (let key in data.structure) {
          let value = data.structure[key];

          if (key == 'asterism') {
            this.log('key=asterism');
            for (let key1 in value) {
              let item = [];
              let value1 = value[key1];
              this.log(value1);
              switch (key1) {
                case '1':
                  item.push('紧密星群');
                  break;
                case '2':
                  item.push('疏松星群');
                  break;
                case '3':
                  item.push('分散星群');
                  break;
              }
              for (let i = 0; i < value1.length; i++) {
                let value2 = value1[i];
                this.log(i + ' sub=');
                this.log(value2);
                for (let j = 0; j < value2.length; j++) {
                  let value3 = value2[i];
                  let item_item = [];
                  item_item.push(value3.id);
                  item_item.push(value3.in_sign_id);
                  item_item.push(value3.in_house_id);
                  if (j != value2.length - 1) {
                    item_item.push('+');
                  }
                  item.push(item_item);
                }
              }
              jiegou.push(item);
            }
          } else {
            this.log(value);
            for (let i = 0; i < value.length; i++) {
              let value1 = value[i];
              let item = [];
              switch (key) {
                case 'trine':
                  item.push('大三角');
                  break;
                case 'small_triangle':
                  item.push('小三角');
                  break;
                case 't_square':
                  item.push('T三角');
                  break;
                case 'cross':
                  item.push('大十字');
                  break;
                case 'bridge_triangle':
                  item.push('楔形三角');
                  break;
                case 'kite':
                  item.push('风筝');
                  break;
                case 'envelop':
                  item.push('大信封');
                  break;
              }
              for (let j = 0; j < value1.length; j++) {
                let value2 = value1[j];
                let item_item = [];
                item_item.push(value2.id);
                item_item.push(value2.in_sign_id);
                item_item.push(value2.in_house_id);
                if (j != value1.length - 1) {
                  item_item.push('+');
                }
                item.push(item_item);
              }
              jiegou.push(item);
            }
          }
        }
      }
      // this.log('jiegou=');
      // this.log(jiegou);

      //行星中点
      if (data.structure.midpoint) {
        for (let i = 0; i < data.structure.midpoint.length; i++) {
          let value = data.structure.midpoint[i];
          let item = [];
          item.push(value.id1);
          item.push(value.id2);
          item.push(value.id3);
          zhongdian.push(item);
        }
      }

    }

    return (

      <View className='natal-or-now-params-page'>
        {/*导航栏*/}
        <AtNavBar
          className='nav'
          onClickLeftIcon={this.actionNavBack}
          color='#000'
          leftIconType='chevron-left'
          fixed
          title={getNameFromRecord(record)}
        />

        {/*tabs栏*/}
        <AtTabs
          className='tabs-con'
          swipeable={false}
          scroll
          current={tabsListValue}
          tabList={tabs}
          onClick={this.handleTabsClick.bind(this, 'tabsListValue')}
        >
        </AtTabs>


        {(data && tabsListValue == 0) && (
          <ScrollView
            className='scrollview'
            scrollY
            scrollWithAnimation
            scrollTop='0'
            style={'height: ' + getWindowHeight(false, true) + 'px;'}
          >
            <View className='pane-page-0'>
              {/*行星列表*/}
              <View className='planet-header-con'>
                <View>星体</View>
                <View>星座度数</View>
                <View>宫位</View>
                <View>逆</View>
              </View>
              {data && data.planets.length > 0 && data.planets.map((item) => (
                <View className='planet-item-con'>
                  <View className='name-con'>
                    <View className={'iconfont icon-' + PLANET(item.id)['glyph']} style={'color:' + PLANET(item.id)['color']}></View>
                    <View className='name'>{PLANET(item.id)['whole']}</View>
                  </View>
                  <View className='sign-con'>
                    <View
                      className={'iconfont icon-' + CONS[item.in_sign_id-1]['glyph']}
                      style={'color:' + CONS[item.in_sign_id-1]['color']}
                    ></View>
                    <View className='name'>{CONS[item.in_sign_id-1]['name']}</View>
                    <View className='deg'>{item.in_sign_deg}</View>
                  </View>
                  <View className='house'>{item.in_house_id}<Text className='house-des'>宫</Text></View>
                  <View className='speed'>{item.speed < 0 ? '逆' : ''}</View>
                </View>
              ))}

              {/*宫位列表*/}
              <View className='house-header-con'>
                <View>宫位</View>
                <View>宫头度数</View>
                <View>宫主飞星</View>
              </View>
              {data && data.houses.length > 0 && data.houses.map((item, index) => (
                <View className='house-item-con'>
                  <View className='name-con'>
                    <View
                      className='name'
                      style={'color:' + HOUSE((index + 1).toString())['color']}
                    >{parseInt(index+1)}
                      <Text
                        className='house-des'
                      >宫</Text>
                    </View>
                  </View>
                  <View className='sign-con'>
                    <View
                      className={'iconfont icon-' + CONS[item.in_sign_id - 1]['glyph']}
                      style={'color:' + CONS[item.in_sign_id - 1]['color']}
                    ></View>
                    <View className='name'>{CONS[item.in_sign_id - 1]['name']}</View>
                    <View className='deg'>{item.in_sign_deg}</View>
                  </View>
                  <View className='house-con'>
                    <View
                      className='name'
                    >{tid == 2 ? PLANET(item.protect_ancient_id)['whole'] : PLANET(item.protect_id)['whole']}
                      <Text className='des'>落在</Text>
                      {tid == 2 ? item.protect_ancient_inhouse_id : item.protect_inhouse_id}
                      <Text className='des'>宫</Text>
                    </View>
                  </View>
                </View>
              ))}

              {/*相位列表*/}
              <View className='header'>相位</View>
              <View className='phase-header-con'>
                {phase_headers.length > 0 && phase_headers.map((item) => (
                  <View className='planet'>{item}</View>
                ))}
              </View>
              {phase_temp.length > 0 && phase_temp.map((item, index) => (
                <View
                  className={index % 2 == 0 ? 'phase-item-con phase-item-con-bg' : 'phase-item-con'}
                >
                  {item.length > 0 && item.map((item2, index2) => (
                    <View
                      className={index2 == 0 ? 'phase column-first' : 'phase'}
                      style={index2 > 0 && item2 != ' ' ? 'color:' + PHASE(item2)['color'] : ''}
                    >{index2 > 0 && item2 != ' ' ? PHASE(item2)['cn'] : item2}</View>
                  ))}
                </View>
              ))}

              <View className='bottom-con'></View>
            </View>
          </ScrollView>
        )}


        {(data && tabsListValue == 1) && (
          <ScrollView
            className='scrollview'
            scrollY
            scrollWithAnimation
            scrollTop='0'
            style={'height: ' + getWindowHeight(false, true) + 'px;'}
          >
            <View className='pane-page-1'>
              <View className='header'>力量分部</View>
              {influence && influence.length > 0 && influence.map((item) => (
                <View className='influence-row-con'>
                  {item.length > 0 && item.map((item2) => (
                    <View className='item-con'>
                      {!Array.isArray(item2) ? item2 : (
                        <View>
                          {item2.length > 0 && item2.map((item3) => (
                            <Text className={'iconfont icon-' + PLANET(item3)['glyph']}></Text>
                          ))}
                        </View>
                      )}
                    </View>
                  ))}
                </View>
              ))}

              {/*先天尊贵*/}
              <View className='header'>先天尊贵</View>
              {planet_ancients && planet_ancients.length > 0 && planet_ancients.map((item, index) => (
                <View className='planet-ancients-row-con'>
                  {item.length > 0 && item.map((item2, index2) => (
                    <View className='item-con'>
                      {index == 0 && item2}

                      {/*星*/}
                      {index != 0 && index2 == 0 && (
                        <Text
                          className={'iconfont icon-' + PLANET(item2)['glyph']}
                          style={'color:' + PLANET(item2)['color']}
                        />
                      )}
                      {/*黄经*/}
                      {index != 0 && index2 == 1 && (
                        <View>
                          <Text
                            className={'title iconfont icon-' + PLANET(item2[0])['glyph']}
                          />
                          <Text className='deg'>{item2[1]}</Text>
                        </View>
                      )}
                      {/*本、升*/}
                      {index != 0 && (index2 == 2 || index2 == 3) && item2 != -1 && item2 != ''
                      && (
                        <Text
                          className={'title iconfont icon-' + PLANET(item2)['glyph']}
                        />
                      )
                      }
                      {/*三分*/}
                      {index != 0 && (index2 == 4) && item2 != -1 && item2 != ''
                      && (
                        <View className='sanfen-con'>
                          <Text
                            className={'title iconfont icon-' + PLANET(item2[0])['glyph']}
                          />
                          <Text
                            className={'title iconfont icon-' + PLANET(item2[1])['glyph']}
                          />
                          <Text
                            className={'title iconfont icon-' + PLANET(item2[2])['glyph']}
                          />
                        </View>
                      )
                      }
                      {/*十、界、弱、陷*/}
                      {index != 0 && (index2 >= 5 && index2 <= 8) && item2 != -1 && item2 != ''
                      && (
                        <Text
                          className={'title iconfont icon-' + PLANET(item2)['glyph']}
                        />
                      )
                      }
                      {/*分数*/}
                      {index != 0 && index2 == 9 && item2 != -1 && item2 != '' && item2}
                    </View>
                  ))}
                </View>
              ))}


              {/*后天状态*/}
              <View className='header'>后天状态</View>
              {planet_ancients_houtian && planet_ancients_houtian.length > 0 && planet_ancients_houtian.map((item, index) => (
                <View className='planet-ancients-row-con'>
                  {item.length > 0 && item.map((item2, index2) => (
                    <View className='item-con'>
                      {index == 0 && item2}

                      {/*星*/}
                      {index != 0 && index2 == 0 && (
                        <Text
                          className={'iconfont icon-' + PLANET(item2)['glyph']}
                          style={'color:' + PLANET(item2)['color']}
                        />
                      )}
                      {/*黄经*/}
                      {index != 0 && index2 == 1 && (
                        <View>
                          <Text
                            className={'title iconfont icon-' + PLANET(item2[0])['glyph']}
                          />
                          <Text className='deg'>{item2[1]}</Text>
                        </View>
                      )}

                      {index != 0 && index2 >= 2 && item2 != -1 && item2 != '' && item2}
                    </View>
                  ))}
                </View>
              ))}

              {/*福点*/}
              <View className='header'>福点</View>
              {fortunes && fortunes.length > 0 && fortunes.map((item) => (
                <View className='fortune-item-con'>
                  <View className='item'>{item[0]}</View>
                  <View className='item'>{item[1]}</View>
                </View>
              ))}

              {/*互容接纳*/}
              <View className='header'>福互容接</View>
              {hurong_and_jiena && hurong_and_jiena.length > 0 && hurong_and_jiena.map((item) => (
                <View className='hurong-and-jiena-item-con'>

                  {item[0] == 1 && (
                    // 接纳
                    <View className='jiena-con'>
                      <Text
                        className={'iconfont icon-' + PLANET(item[1])['glyph']}
                        style={'color:' + PLANET(item[1])['color']}
                      />
                      <Text className='title'>{item[2]}</Text>
                      <Text
                        className={'iconfont icon-' + PLANET(item[3])['glyph']}
                        style={'color:' + PLANET(item[3])['color']}
                      />
                      <Text className='des'>{item[4]}</Text>
                      <Text className='title'>{item[5]}</Text>
                    </View>
                  )}

                  {item[0] == 2 && (
                    // 互容
                    <View className='jiena-con'>
                      <Text
                        className={'iconfont icon-' + PLANET(item[1])['glyph']}
                        style={'color:' + PLANET(item[1])['color']}
                      />
                      <Text className='des'>{item[2]}</Text>
                      <Text className='title'>{item[3]}</Text>
                      <Text
                        className={'iconfont icon-' + PLANET(item[4])['glyph']}
                        style={'color:' + PLANET(item[4])['color']}
                      />
                      <Text className='des'>{item[5]}</Text>
                      <Text className='title'>{item[6]}</Text>
                    </View>
                  )}

                </View>
              ))}

              {/*映点反映点*/}
              <View className='header'>映点反映点</View>
              {yingdian_and_fanyingdian && yingdian_and_fanyingdian.length > 0 && yingdian_and_fanyingdian.map((item) => (
                <View className='hurong-and-jiena-item-con'>
                  <View className='jiena-con'>
                    <Text
                      className={'iconfont icon-' + PLANET(item[0])['glyph']}
                      style={'color:' + PLANET(item[0])['color']}
                    />
                    <Text className='title'>{item[1]}</Text>
                    <Text
                      className={'iconfont icon-' + PLANET(item[2])['glyph']}
                      style={'color:' + PLANET(item[2])['color']}
                    />
                    <Text className='title'>{item[3]}</Text>
                  </View>
                </View>
              ))}

              {/*纬照反纬照*/}
              <View className='header'>纬照反纬照</View>
              {according && according.length > 0 && according.map((item) => (
                <View className='hurong-and-jiena-item-con'>
                  <View className='jiena-con'>
                    <Text
                      className={'iconfont icon-' + PLANET(item[0])['glyph']}
                      style={'color:' + PLANET(item[0])['color']}
                    />
                    <Text className='title'>{item[1]}</Text>
                    <Text
                      className={'iconfont icon-' + PLANET(item[2])['glyph']}
                      style={'color:' + PLANET(item[2])['color']}
                    />
                    <Text className='title'>{item[3]}</Text>
                  </View>
                </View>
              ))}

              {/*恒星会合*/}
              <View className='header'>恒星会合</View>
              {star && star.length > 0 && star.map((item) => (
                <View className='hurong-and-jiena-item-con'>
                  <View className='jiena-con'>
                    <Text className='title'>{item[0]}</Text>
                    <Text
                      className={'des iconfont icon-' + CONS[item[1]]['glyph']}
                    />
                    <Text className='des'>{item[2]}</Text>
                    <Text className='title'>{item[3]}</Text>
                    <Text
                      className={'iconfont icon-' + PLANET(item[4])['glyph']}
                      style={'color:' + PLANET(item[4])['color']}
                    />
                    <Text className='title'>{item[5]}</Text>
                  </View>
                </View>
              ))}

              {/*特殊度数*/}
              <View className='header'>特殊度数</View>
              {dushu && dushu.length > 0 && dushu.map((item) => (
                <View className='hurong-and-jiena-item-con'>
                  <View className='jiena-con'>
                    <Text
                      style={'color:' + PLANET(item[0])['color']}
                      className={'iconfont icon-' + CONS[item[0]]['glyph']}
                    />
                    <Text className='title'>{item[1]}</Text>
                  </View>
                </View>
              ))}

              <View className='bottom-con'></View>
            </View>

          </ScrollView>
        )}

        {(data && tabsListValue == 2) && (
          <ScrollView
            className='scrollview'
            scrollY
            scrollWithAnimation
            scrollTop='0'
            style={'height: ' + getWindowHeight(false, true) + 'px;'}
          >
            <View className='pane-page-2'>
              {/*行星结构*/}
              <View className='header'>行星结构</View>
              {jiegou && jiegou.length > 0 && jiegou.map((item) => (
                <View className='struct-item-con'>
                  {item && item.length > 0 && item.map((item2, index2) => (
                    <View className='struct-con'>
                      {index2 == 0 && (
                        <View className='first'>{item2}</View>
                      )}
                      {index2 > 0 && item2 && item2.length > 0 && item2.map((item3, index3) => (
                        <View className='item-con'>
                          {index3 == 0 && (
                            <Text className='title'>{CONS[item3 - 1].item}</Text>
                          )}
                          {index3 == 1 && (
                            <Text
                              className={'des iconfont icon-' + CONS[item3 - 1]['glyph']}
                            />
                          )}
                          {index3 == 2 && (
                            <Text className='des'>{item3}宫</Text>
                          )}
                          {index3 == 3 && (
                            <Text className='title margin-add'>{item3}</Text>
                          )}
                        </View>
                      ))}
                    </View>
                  ))}
                </View>
              ))}

              {/*行星中点*/}
              <View className='header'>行星中点</View>
              <View className='zhongdian-item-con'>
                {zhongdian && zhongdian.length > 0 && zhongdian.map((item) => (
                  <View className='item-con'>
                    <Text className='des'>{PLANET(item[0])['whole']}</Text>
                    <Text className='title'>+</Text>
                    <Text className='des'>{PLANET(item[1])['whole']}</Text>
                    <Text className='title'>={PLANET(item[2])['whole']}</Text>
                  </View>
                ))}
              </View>
              <View className='bottom-con'></View>
            </View>
          </ScrollView>
        )}

      </View>
    )
  }

}

export default natalOrNowParamsDetail;
