// 创建画布
window.draw = SVG('drawing').size(canvas, canvas);
window.svg = {};


svg.drawSignAndHouse = function ()
{
    for (var i=1; i<13; i++)
    {
        draw.line(sign[i].line.x1, sign[i].line.y1, sign[i].line.x2,sign[i].line.y2).stroke({ width: 1, color:sign[i].line.color});
        draw.text(sign[i].text.sign_glyph).font({ family:sign[i].text.family, size:sign[i].text.size, weight:300 }).attr({ x:sign[i].text.x, y:sign[i].text.y, stroke:'none' }).fill(sign[i].text.color);
        draw.text(sign[i].protect.protect_glyph).font({ family:sign[i].protect.family, size:sign[i].protect.size, weight:300 }).attr({ x:sign[i].protect.x, y:sign[i].protect.y, stroke:'none' }).fill(sign[i].protect.color);

        draw.line(house[i].line.x1, house[i].line.y1, house[i].line.x2,house[i].line.y2).stroke({ width: 1, color:house[i].line.color});
        draw.text(house[i].text.house_glyph).font({ family:'xzns', size:house[i].text.size, weight:300 }).attr({ x:house[i].text.x, y:house[i].text.y, stroke:'none' }).fill(house[i].text.color);
    }
}
// 默认为文字版
svg.drawPlanet = function ()
{
    for (var i in planet1)
    {
        // 图标版四轴为path
        if (planet1[i].family == '' && getCookie('lang') == 'en')
        {
            var pla1 = draw.path(planet1[i].planet_glyph).fill('none').stroke({ width: 2, color:planet1[i].color}).attr({cursor:'pointer',i:planet1[i].id,'class':'planet1'});
        }
        else
        {
            var pla1 = draw.text(planet1[i].planet_glyph).font({ family:planet1[i].family, size:planet1[i].size, weight:300,style:'normal',stretch:'normal' }).attr({ x:planet1[i].x2, y:planet1[i].y2, stroke:'none',cursor:'pointer',i:planet1[i].id,'class':'planet1'}).fill(planet1[i].color);
        }

        draw.line(planet1[i].x1, planet1[i].y1, planet1[i].x3, planet1[i].y3).stroke({ width: 1, color:'#828282'});

        draw.circle(3).attr({ cx :planet1[i].x1, cy :planet1[i].y1}).fill(planet1[i].color).stroke({ width: 1, color:planet1[i].color });
    }
    if (planet2.length == 0) return;

    for (var j in planet2)
    {
        if (planet2[j].family == '' && getCookie('lang') == 'en')
        {
            var pla2 = draw.path(planet2[j].planet_glyph).fill('none').stroke({ width: 2, color:planet2[j].color}).attr({cursor:'pointer',i:planet2[j].id,'class':'planet2'});
        }
        else
        {
            var pla2 = draw.text(planet2[j].planet_glyph).font({ family:planet2[j].family, size:planet2[j].size, weight:300,style:'normal',stretch:'normal' }).attr({ x:planet2[j].x2, y:planet2[j].y2, stroke:'none',cursor:'pointer',i:planet2[j].id,'class':'planet2'}).fill(planet2[j].color);
        }

        draw.line(planet2[j].x1, planet2[j].y1, planet2[j].x3, planet2[j].y3).stroke({ width: 1, color:'#828282'});

        draw.circle(3).attr({ cx :planet2[j].x1, cy :planet2[j].y1}).fill(planet2[j].color).stroke({ width: 1, color:planet2[j].color });
    }
}
svg.drawAspectLine = function ()
{
    for (var i in phase)
    {
        draw.line(phase[i].x1, phase[i].y1, phase[i].x2, phase[i].y2).stroke({ width: 1, color:phase[i].color});
    }
}
svg.drawDetails = function ()
{
    var p1name = '本命星';

    if(action == 'now')
    {
        p1name = '天象星';
    }
    else if(action == 'transits')
    {
        var p2name = '行运星';
    }
    else if(action == 'synastry')
    {
        p1name = '本命星1';
        var p2name = '本命星2';
    }
    else if(action == 'composite')
    {
        p1name = '合盘星';
    }
    else if(action == 'progressions')
    {
        p1name = '次限星';
    }
    else if(action == 'thirdprogressed')
    {
        p1name = '三限星';
    }
    else if(action == 'solar')
    {
        var p2name = '日弧星';
    }
    else if(action == 'composite_progressions')
    {
        p1name = '组次星';
    }
    else if(action == 'composite_thirdprogressed')
    {
        p1name = '组三星';
    }
    else if(action == 'davison')
    {
        p1name = '时空中点星';
    }
    var p1 = '<thead><tr><th>'+p1name+'</th><th>度数</th><th>飞宫</th><th>顺逆</th></tr></thead><tbody>';
    for (var i in planet1)
    {
        var in_house = (planet1[i].in_house_id < 10) ? '&nbsp;&nbsp;'+planet1[i].in_house_id : planet1[i].in_house_id;
        var retro = (planet1[i].retro == '逆行' && i<=12) ? '逆行' : '-';
        var planet_glyph = planet1[i].planet_glyph;
        if (planet1[i].id == 15) planet_glyph = 'Asc';
        else if (planet1[i].id == 16) planet_glyph = 'IC';
        else if (planet1[i].id == 17) planet_glyph = 'Des';
        else if (planet1[i].id == 18) planet_glyph = 'MC';
        p1 += '<tr>';
        p1 += '<td><font color="'+planet1[i].color+'" face="'+planet1[i].family+'">'+planet_glyph+'</font>&nbsp;&nbsp;'+planet1[i].name_whole+'</td>';
        p1 += '<td><font color="'+planet1[i].in_sign_glyph_color+'" face="xzns">'+planet1[i].in_sign_glyph+'</font>&nbsp;&nbsp;'+planet1[i].in_sign_whole+'&nbsp;&nbsp;'+planet1[i].in_sign_deg+'</td>';
        p1 += '<td>'+in_house+'宫</td>';
        p1 += '<td align="center">'+retro+'</td>';
        p1 += '</tr>';
    }
    p1 += '</tbody>';

    if (planet2.length != 0)
    {

        p1 += '<thead><tr><th>'+p2name+'</th><th>度数</th><th>飞宫</th><th>顺逆</th></tr></thead><tbody>';
        for (var i in planet2)
        {
            var in_house = (planet2[i].in_house_id < 10) ? '&nbsp;&nbsp;'+planet2[i].in_house_id : planet2[i].in_house_id;
            var retro = (planet2[i].retro == '逆行' && i<=12) ? '逆行' : '-';
            var planet_glyph = planet2[i].planet_glyph;
            if (planet2[i].id == 15) planet_glyph = 'Asc';
            else if (planet2[i].id == 16) planet_glyph = 'IC';
            else if (planet2[i].id == 17) planet_glyph = 'Des';
            else if (planet2[i].id == 18) planet_glyph = 'MC';
            p1 += '<tr>';
            p1 += '<td><font color="'+planet2[i].color+'" face="'+planet2[i].family+'">'+planet_glyph+'</font>&nbsp;&nbsp;'+planet2[i].name_whole+'</td>';
            p1 += '<td><font color="'+planet2[i].in_sign_glyph_color+'" face="xzns">'+planet2[i].in_sign_glyph+'</font>&nbsp;&nbsp;'+planet2[i].in_sign_whole+'&nbsp;&nbsp;'+planet2[i].in_sign_deg+'</td>';
            p1 += '<td>'+in_house+'宫</td>';
            p1 += '<td align="center">'+retro+'</td>';
            p1 += '</tr>';
        }
    }

    var details_planet = document.getElementById('details-planet');
    details_planet.innerHTML = p1;


    var h1 = '<thead><tr><th>宫头</th><th>度数</th><th>宫主星</th></tr></thead><tbody>';
    for (var i in house)
    {
        var house_glyph = (i < 10) ? '&nbsp;&nbsp;'+house[i].text.house_glyph : house[i].text.house_glyph;
        h1 += '<tr>';
        h1 += '<td><font color="'+house[i].text.color+'">'+house_glyph+'</font>宫<font color = "#999" size="2">('+house[i].text.name_whole+')</font></td>';
        h1 += '<td><font color="'+house[i].text.in_sign_glyph_color+'" face="xzns">'+house[i].text.in_sign_glyph+'</font>&nbsp;&nbsp;'+house[i].text.in_sign_whole+'&nbsp;&nbsp;'+house[i].text.in_sign_deg+'</td>';
        h1 += '<td><font color="'+house[i].protect.color+'" face="xzns">'+house[i].protect.protect_glyph+'</font>&nbsp;&nbsp;'+house[i].protect.name_whole+'</td>';
        h1 += '</tr>';
    }
    h1 += '</tbody>';
    var details_house = document.getElementById('details-house');
    details_house.innerHTML = h1;

    var ph1 = '<tbody>';
    for (var i in planet1)
    {
        var planet_glyphi = planet1[i].planet_glyph;
        if (planet1[i].id == 15) planet_glyphi = 'Asc';
        // else if (planet1[i].id == 16) planet_glyphi = 'IC';
        // else if (planet1[i].id == 17) planet_glyphi = 'Des';
        else if (planet1[i].id == 18) planet_glyphi = 'MC';
        // 横向
        if ( i == 0)
        {
            ph1 += '<tr  style="height: 30px;">';
            for (var j in planet1)
            {
                if (j==0) {ph1 += '<td>&nbsp;&nbsp;</td>';}
                var planet_glyphj = planet1[j].planet_glyph;
                if (planet1[j].id == 15) planet_glyphj = 'Asc';
                // else if (planet1[j].id == 16) planet_glyphj = 'IC';
                // else if (planet1[j].id == 17) planet_glyphj = 'Des';
                else if (planet1[j].id == 18) planet_glyphj = 'MC';
                if( j != 10 && j != 11 && j != 12 && j != 13 && j != 14 && j != 16 && j != 17)
                ph1 += '<td style="width: 7.69%;"><font color="'+planet1[j].color+'" face="'+planet1[j].family+'">'+planet_glyphj+'</font></td>';
            }
            ph1 += '</tr>';
        }
        ph1 += '<tr style="height: 30px;">';
        for (var k in planet1)
        {
            var planet_glyphk = planet1[k].planet_glyph;
            if (planet1[k].id == 15) planet_glyphk = 'Asc';
            else if (planet1[k].id == 16) planet_glyphk = 'IC';
            else if (planet1[k].id == 17) planet_glyphk = 'Des';
            else if (planet1[k].id == 18) planet_glyphk = 'MC';
            // 纵向
            if ( k == 0 && k != 10 && k != 11 && k != 12 && k != 13 && k != 14 && k != 16 && k != 17)
            {

                ph1 += '<td style="width: 7.69%;"><font color="'+planet1[i].color+'" face="'+planet1[i].family+'">'+planet_glyphi+'</font></td>';
            }
            if (k != 10 && k != 11 && k != 12 && k != 13 && k != 14 && k != 16 && k != 17)
            {
                var pha = planet1[i]['phase'][i+'-'+k] ? '<font face="xzns" color="'+planet1[i]['phase'][i+'-'+k].phase_color+'">'+planet1[i]['phase'][i+'-'+k].phase_glyph+'</font>' : ' ';
                ph1 += '<td>'+pha+'</td>';
            }

        }
        ph1 += '</tr>';
    }
    ph1 += '</tbody>';
    var details_house = document.getElementById('details-phase');
    details_house.innerHTML = ph1;
}
// 法达 主
svg.drawMainLuck = function ()
{
    var main = firdaria['main'];

    for(var i in main)
    {
        if(i != 0)
        {
            draw.path('M'+main[i-1].x2+','+main[i-1].y2+'L'+main[i-1].x1+','+main[i-1].y1+'A'+main[i].ro+','+main[i].ro+',0,0,1,'+main[i].x1+','+main[i].y1+'L'+main[i].x2+','+main[i].y2+'A'+main[i].r+','+main[i].r+',0,0,0,'+main[i-1].x2+','+main[i-1].y2+',z').fill(main[i].fill).stroke('#ffffff').attr({cursor:'pointer',class:'planet_main',i:i});
        }
        // draw.line(main[i].x1, main[i].y1,main[i].x2, main[i].y2).stroke({ width: 1, color:main[i].color});
        if( i == 0) continue;// 起点位置无行星
        draw.text(main[i].planet_glyph).font({ family:main[i].family, size:main[i].size, weight:300,style:'normal',stretch:'normal' }).attr({ x:main[i].x, y:main[i].y, stroke:'none',cursor:'pointer',class:'planet_main',i:i}).fill(main[i].glyph_color);
        if(main[i].ages != '') draw.text(main[i].ages.age + '岁').font({ size:main[i].ages.size, weight:300,style:'normal',stretch:'normal' }).attr({ x:main[i].ages.x, y:main[i].ages.y, stroke:'none'}).fill('#fff');
    }

}
// 法达 次
svg.drawSubLuck = function ()
{
    var sub = firdaria['sub'];

    for(var i in sub)
    {
        if(i != 0)
        {
            draw.path('M'+sub[i-1].x2+','+sub[i-1].y2+'L'+sub[i-1].x1+','+sub[i-1].y1+'A'+sub[i].ro+','+sub[i].ro+',0,0,1,'+sub[i].x1+','+sub[i].y1+'L'+sub[i].x2+','+sub[i].y2+'A'+sub[i].ri+','+sub[i].ri+',0,0,0,'+sub[i-1].x2+','+sub[i-1].y2+',z').fill(sub[i].fill).stroke('#fff').attr({cursor:'pointer','class':'planet_sub',i:i});
        }
        // draw.line(sub[i].x1, sub[i].y1, sub[i].x2, sub[i].y2).stroke({ width: 1, color:sub[i].color});
        if( i == 0) continue;// 起点位置无行星
        draw.text(sub[i].planet_glyph).font({ family:sub[i].family, size:sub[i].size, weight:300,style:'normal',stretch:'normal' }).attr({ x:sub[i].x, y:sub[i].y, stroke:'none',cursor:'pointer','class':'planet_sub',i:i}).fill(sub[i].glyph_color);
    }
}
// 小限
svg.drawProfection = function ()
{
    // 流年
    if (action == 'profection')
    {
        var prof = profection.profection;
        for(var i in prof)
        {
            draw.path('M'+prof[i].x1+','+prof[i].y1+'L'+prof[i].x2+','+prof[i].y2+'A'+prof[i].r+','+prof[i].r+',0,0,1,'+prof[i].x4+','+prof[i].y4+'L'+prof[i].x3+','+prof[i].y3+'A'+prof[i].ro+','+prof[i].ro+',0,0,0,'+prof[i].x1+','+prof[i].y1+',z').fill(prof[i].fill).stroke('#fff').attr({cursor:'pointer','class':'planet_profection',i:i});

            draw.text(prof[i].protect_glyph).font({ family:prof[i].family, size:prof[i].size, weight:300,style:'normal',stretch:'normal' }).attr({ x:prof[i].x, y:prof[i].y, stroke:'none',cursor:'pointer','class':'planet_profection',i:i}).fill(prof[i].color);
        }
    }
    // 流月
    else if(action == 'profection_monthly')
    {
        var monthly = profection.monthly;

        for(var j in monthly)
        {
            draw.path('M'+monthly[j].x1+','+monthly[j].y1+'L'+monthly[j].x2+','+monthly[j].y2+'A'+monthly[j].r+','+monthly[j].r+',0,0,1,'+monthly[j].x4+','+monthly[j].y4+'L'+monthly[j].x3+','+monthly[j].y3+'A'+monthly[j].ro+','+monthly[j].ro+',0,0,0,'+monthly[j].x1+','+monthly[j].y1+',z').fill(monthly[j].fill).stroke('#fff').attr({cursor:'pointer','class':'profection_monthly',i:j});

            draw.text(monthly[j].protect_glyph).font({ family:monthly[j].family, size:monthly[j].size, weight:300,style:'normal',stretch:'normal' }).attr({ x:monthly[j].x, y:monthly[j].y, stroke:'none',cursor:'pointer','class':'profection_monthly',i:j}).fill(monthly[j].color);
        }
    }
}

svg.initload = function ()
{
    if(action == 'firdaria')
    {
        diameter = canvas - canvas*(12/640);
        diameter2 = diameter - canvas*(60/640);
        diameter3 = diameter2 - canvas*(80/640);
        diameter4 = diameter3 - canvas*(80/640);
        diameter5 = diameter4 - canvas*(60/640);

        draw.fill('#1C9692').stroke({ width: 1, color:bd_color }).circle(diameter).attr({ cx :center_x, cy :center_y});

        draw.stroke({ width: 1, color:bd_color }).circle(diameter2).attr({ cx :center_x, cy :center_y , fill:'#1C9692'});

        svg.drawMainLuck();
        svg.drawSubLuck();

        var luck_line = firdaria['luck_line'];
        window.mainDetails = firdaria['main_sub_details'][0];
        window.subDetails = firdaria['main_sub_details'][1];

        draw.line(luck_line.x1, luck_line.y1,luck_line.x2, luck_line.y2).stroke({ width: 1, color:luck_line.color});


        draw.stroke({ width: 1, color:bd_color }).circle(diameter3).attr({ cx :center_x, cy :center_y , fill:bg_color});

        draw.stroke({ width: 1, color:bd_color }).circle(diameter4).attr({ cx :center_x, cy :center_y , fill:bg_color});

        draw.stroke({ width: 1, color:bd_color }).circle(diameter5).attr({ cx :center_x, cy :center_y , fill:bg_color});

    }
    else if(action == 'profection' || action == 'profection_monthly')
    {
        diameter = canvas - canvas*(12/640);
        diameter2 = diameter - canvas*(80/640);// 小限
        diameter3 = diameter2 - canvas*(80/640);// 星座内○，宫外○
        diameter4 = diameter3 - canvas*(60/640);// 宫内○

        draw.fill('#1C9692').stroke({ width: 1, color:bd_color }).circle(diameter).attr({ cx :center_x, cy :center_y});

        draw.stroke({ width: 1, color:bd_color }).circle(diameter2).attr({ cx :center_x, cy :center_y , fill:bg_color});

        svg.drawProfection();
        // this.log(profection);
        window.mainDetails = profection['annualprofetctiondetails'][0];
        window.subDetails = profection['annualprofetctiondetails'][1];

        draw.stroke({ width: 1, color:bd_color }).circle(diameter3).attr({ cx :center_x, cy :center_y , fill:bg_color});

        draw.stroke({ width: 1, color:bd_color }).circle(diameter4).attr({ cx :center_x, cy :center_y , fill:bg_color});
    }
    else
    {
        draw.fill(bg_color).stroke({ width: 1, color:bd_color }).circle(diameter-2).attr({ cx :center_x, cy :center_y});

        draw.stroke({ width: 1, color:bd_color }).circle(diameter3).attr({ cx :center_x, cy :center_y , fill:bg_color});

        draw.stroke({ width: 1, color:bd_color }).circle(diameter4).attr({ cx :center_x, cy :center_y , fill:bg_color});

    }
    svg.drawSignAndHouse();// 星座和宫头
    svg.drawAspectLine();
    svg.drawPlanet();
    svg.drawDetails();
    // 更改前台显示 太阳或月亮返照的具体时间
    // if()
}

// 星盘行星1 弹层提示
mui("#drawing").on('tap','.planet1',function(){
    var deg = document.getElementById('deg');
    var inhouse = document.getElementById('inhouse');
    var phase = document.getElementById('phase');
    var pldata = document.getElementById('pl-data');
    var id1 = this.getAttribute('i');

    var insign_p = document.getElementById('planet');

    insign_p.innerText = planet1[id1].name_whole;

    var this_pl_data1 = ' 在 ' + planet1[id1]['in_sign_whole'] + "\n" + planet1[id1]['in_sign_deg'];

    deg.innerText = this_pl_data1;

    this_pl_data1 = '在第' + planet1[id1]['in_house_id'] + '宫' + "\n" + planet1[id1]['in_house_whole'];

    inhouse.innerText = this_pl_data1;

    this_pl_data1 = '';

    // 是否存在相位
    if(planet1[id1]['phase'].length == undefined)
    {
        for (var j in planet1[id1]['phase'])
        {
          this_pl_data1 += planet1[id1]['phase'][j]['whole']+"\n";
        }
    }
    phase.innerText = this_pl_data1;

    pldata.style.display = 'block';
})
// 星盘行星2 弹层提示
mui("#drawing").on('tap','.planet2',function(){
    var deg = document.getElementById('deg');
    var inhouse = document.getElementById('inhouse');
    var phase = document.getElementById('phase');
    var pldata = document.getElementById('pl-data');
    var id2 = this.getAttribute('i');

    var insign_p = document.getElementById('planet');

    insign_p.innerText = planet2[id2].name_whole;

    var this_pl_data2 = ' 在 ' + planet2[id2]['in_sign_whole'] + "\n" + planet2[id2]['in_sign_deg'];

    deg.innerText = this_pl_data2;

    this_pl_data2 = '在第' + planet2[id2]['in_house_id'] + '宫' + "\n" + planet2[id2]['in_house_whole'];

    inhouse.innerText = this_pl_data2;

    this_pl_data2 = '';
    // 是否存在相位
    if(planet2[id2]['phase'].length == undefined)
    {
        for (var j in planet2[id2]['phase'])
        {
          this_pl_data2 += planet2[id2]['phase'][j]['whole']+"\n";
        }
    }

    phase.innerText = this_pl_data2;

    pldata.style.display = 'block';
})
// 法达大运弹层提示
mui("#drawing").on('tap','.planet_main',function(){
    var deg = document.getElementById('deg');
    var inhouse = document.getElementById('inhouse');
    deg.innerText = '';
    inhouse.innerText = '';
    var phase = document.getElementById('phase');
    var pldata = document.getElementById('pl-data');
    var id1 = this.getAttribute('i') - 1;

    var insign_p = document.getElementById('planet');

    insign_p.innerText = mainDetails[id1].title;

    var this_pl_data1 = '';
    this_pl_data1 += mainDetails[id1].year+"\n";
    this_pl_data1 += mainDetails[id1].age+"\n";

    phase.innerText = this_pl_data1;

    pldata.style.display = 'block';
})
// 法达小运弹层提示
mui("#drawing").on('tap','.planet_sub',function(){
    var deg = document.getElementById('deg');
    var inhouse = document.getElementById('inhouse');
    deg.innerText = '';
    inhouse.innerText = '';
    var phase = document.getElementById('phase');
    var pldata = document.getElementById('pl-data');
    var id1 = this.getAttribute('i') - 1;

    var insign_p = document.getElementById('planet');

    insign_p.innerText = subDetails[id1].title;

    var this_pl_data1 = '';
    this_pl_data1 += subDetails[id1].year+"\n";
    this_pl_data1 += subDetails[id1].age+"\n";

    phase.innerText = this_pl_data1;

    pldata.style.display = 'block';
})
// 小限流年弹层提示
mui("#drawing").on('tap','.planet_profection',function(){
    // this.log('测试')
    var deg = document.getElementById('deg');
    var inhouse = document.getElementById('inhouse');
    deg.innerText = '';
    inhouse.innerText = '';
    var phase = document.getElementById('phase');
    var pldata = document.getElementById('pl-data');
    var id1 = this.getAttribute('i');

    var insign_p = document.getElementById('planet');

    insign_p.innerText = mainDetails[id1].title;

    var this_pl_data1 = '';
    this_pl_data1 += mainDetails[id1].year+"\n";
    this_pl_data1 +=  mainDetails[id1].age+"\n";

    phase.innerText = this_pl_data1;

    pldata.style.display = 'block';
})
// 小限流月弹层提示
mui('#drawing').on('tap','.profection_monthly',function(){
    var deg = document.getElementById('deg');
    var inhouse = document.getElementById('inhouse');
    deg.innerText = '';
    inhouse.innerText = '';
    var phase = document.getElementById('phase');
    var pldata = document.getElementById('pl-data');
    var id1 = this.getAttribute('i');

    var insign_p = document.getElementById('planet');

    insign_p.innerText = subDetails[id1].title;

    var this_pl_data1 = '';
    this_pl_data1 += subDetails[id1].year+"\n";
    // this_pl_data1 += subDetails[id1].age+"\n";

    phase.innerText = this_pl_data1;

    pldata.style.display = 'block';
})

if (getCookie('canvas') == null)
{
    setCookie('canvas', canvas, 'd90');
    mui.post('/transits/now',{set:0},function(data){
        if (data.status == 200)
        {
            if (typeof(result3) != 'undefined') result3.innerHTML = data.date;
            document.getElementById("transits-time").setAttribute('data-options','{"value":"'+data.date+'","beginYear":1900,"endYear":2099}');
            window.sign = JSON.parse(data.svg.sign);
            window.house = JSON.parse(data.svg.house);
            window.planet1 = JSON.parse(data.svg.planet1);
            window.phase = JSON.parse(data.svg.phase);
            window.planet2 = [];
            if (typeof(data.svg.planet2) != 'undefined') window.planet2 = JSON.parse(data.svg.planet2);
            document.getElementById('drawing').innerHTML = '<script xlink:href="/public/js/svg.min.js"></script><script xlink:href="/public/js/svg.config.js"></script><script xlink:href="/public/js/svg_2.js"></script>';
            svg.initload();
        }
        else
        {
            mui.toast('操作失败！');
        }
    },'json');
}


function hidTips(obj)
{
  obj.style.display = 'none';
}
/**
 * 切换日期
 * @param datet  2016-05-06 12:04
 * @param sett  时间改变量(第二参数传默认值的时候  iphone5下JS报错，IE下JS报错不能显示星盘)
 * @returns {{year: number, month: number, day: number, hour: number, minute: number, timezone: number, set: (number|*)}}
 */
function getDate(datet,sett)
{
	var sets = typeof sett == 'undefined' ?  0 : sett;
    var timearr=datet.replace(" ",":").replace(/\:/g,"-").split("-");
    var date = new Date(datet);
    var years = timearr[0]*1;
    var months = timearr[1]*1;
    var days = timearr[2]*1;
    var hours = timearr[3]*1;
    var minu = timearr[4]*1;

    return {'year':years,'month':months,'day':days,'hour':hours,'minute':minu,'timezone':8,'set':sets};
}
