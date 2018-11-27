/**
 * Created by wzs on 2018/11/19.
 */
//防止滚动
$.smartScroll = function(container, selectorScrollable) {
    // 如果没有滚动容器选择器，或者已经绑定了滚动时间，忽略
    if (!selectorScrollable || container.data('isBindScroll')) {
        return;
    }

    var isSBBrowser;

    var data = {
        posY: 0,
        maxscroll: 0
    };

    // 事件处理
    container.on({
        touchstart: function (event) {
            var events =  event;

            // 先求得是不是滚动元素或者滚动元素的子元素
            var elTarget = $(event.target);

            if (!elTarget.length) {
                return;
            }

            var elScroll;

            // 获取标记的滚动元素，自身或子元素皆可
            if (elTarget.is(selectorScrollable)) {
                elScroll = elTarget;
            } else if ((elScroll = elTarget.parents(selectorScrollable)).length == 0) {
                elScroll = null;
            }

            if (!elScroll) {
                return;
            }

            // 当前滚动元素标记
            data.elScroll = elScroll;

            // 垂直位置标记
            data.posY = events.pageY;
            data.scrollY = elScroll.scrollTop();
            // 是否可以滚动
            data.maxscroll = elScroll[0].scrollHeight - elScroll[0].clientHeight;
        },
        touchmove: function (event) {
            // 如果不足于滚动，则禁止触发整个窗体元素的滚动
            if (data.maxscroll <= 0 || isSBBrowser) {
                // 禁止滚动
                event.preventDefault();
            }
            // 滚动元素
            var elScroll = data.elScroll;
            // 当前的滚动高度
            var scrollTop = elScroll.scrollTop();

            // 现在移动的垂直位置，用来判断是往上移动还是往下
            var events = event;
            // 移动距离
            var distanceY = events.pageY - data.posY;

            if (isSBBrowser) {
                elScroll.scrollTop(data.scrollY - distanceY);
                elScroll.trigger('scroll');
                return;
            }

            // 上下边缘检测
            if (distanceY > 0 && scrollTop == 0) {
                // 往上滑，并且到头
                // 禁止滚动的默认行为
                event.preventDefault();
                return;
            }

            // 下边缘检测
            if (distanceY < 0 && (scrollTop + 1 >= data.maxscroll)) {
                // 往下滑，并且到头
                // 禁止滚动的默认行为
                event.preventDefault();
                return;
            }
        },
        touchend: function () {
            data.maxscroll = 0;
        }
    });

    // 防止多次重复绑定
    container.data('isBindScroll', true);
};
(function ($) {

    'namespace Conditional';
    $.fn.Conditional = function (options) {

        var settings = $.extend({
            hasDate: false, //是否有日期框
            setDateTime: '', //设置日期框时间
            setDateID: '',   //设置日期框ID
            selectsData:[]  //初始化数据
        }, options);
        console.log(this)
        var ret = this.each(function () {
            var conObj = this;
            console.log(conObj)
            if (this.optionsFunc)return;
            this.optionsFunc = {
                body: $('body'),
                E: $(conObj),
                buttonClickFlag: 1,
                dialog: '', //遮罩层
                conditionalFilter: '', //外层DIV
                clearButton:'',
                bottomButton: '',
                box: '',
                showAllSelects: '<div class="option arrow" ><a href="javascript:void 0;">查看全部</a></div>',
                showAllModel:'<div class="with_sub_title top46"><ul class="mod_list padding_left"></ul></div>',
                //初始化
                createElems: function () {
                    var O = this;
                    O.dialog = $('<div class="dialog"></div>')
                    O.box = $('<div class="aside" id="aside"></div>')
                    O.conditionalFilter = $('<div class="conditional-filter"><div class="sf_layer_con"></div></div>')
                    O.clearButton = $('<div id="filterClearBtn" class="J_ping s_btn hidden">初始化选项</div>')
                    O.clearButtonDisabled = $('<div id="filterClearBtnDisabled" class="J_ping s_btn disabled">初始化选项</div>')
                    O.bottomButton = $('<div class="filterlayer_bottom_buttons"><span id="cancel" class="filterlayer_bottom_button bg1">取消</span><span class="filterlayer_bottom_button bg2" id="confir">确认</span></div>')
                    O.bottomButtonSecond = $('<div  class="filterlayer_bottom_buttons hidden"><span id="cancel1" class="filterlayer_bottom_button bg1">取消</span><span class="filterlayer_bottom_button bg2" id="confir1">确认</span></div>')
                    O.conditionalFilter.append(O.bottomButton ).append(O.bottomButtonSecond)
                    O.box.append(O.dialog).append(O.conditionalFilter)
                    O.body.append(O.box)
                    O.dialogOnClick(O.dialog)
                    O.E.click(function () {
                        if (settings.selectsData.length == 0) {
                            alert('加载查询条件失败')
                            return;
                        }
                        O.dialog.trigger('click')
                    })
                    O.createUl()
                    O.conditionalFilter.find('.sf_layer_con').append(O.clearButton ).append(O.clearButtonDisabled)
                    O.clearFilter()
                    $('#cancel').click(function () {O.dialog.trigger('click')})
                },
                createUl: function () {
                    var O = this
                    O.hasData()
                    for(var i = 0; i < settings.selectsData.length; i++){
                        var ulModeData = settings.selectsData[i].data;
                        if(ulModeData == undefined) continue
                        var ul =
                            '<ul class="mod_list" id="'+settings.selectsData[i].id+'">' +
                            '<li>' +
                            '<div class="list_inner li_line">' +
                            '<div class="big">'+settings.selectsData[i].title+'</div>' +
                            '<div class="right"><span class="words_10" value="'+settings.selectsData[i].data[0].value+'">'+settings.selectsData[i].data[0].text+'</span></div>' +
                            '</div>' +
                            '</li>' +
                            '<div class="tags_selection" id="'+settings.selectsData[i].id+'option'+'"></div>' +
                            '</ul>'
                        O.conditionalFilter.find('.sf_layer_con').append(ul)
                        var objId = settings.selectsData[i].id + 'option'
                        O.createUlMods(objId,ulModeData,settings.selectsData[i].title)
                    }
                    O.optionOnclick()
                    if(settings.hasDate){
                        O.initDateInput()
                        O.onInputDate()
                    }
                },
                createUlMods: function (objId,ulModeData,title) {
                    var O = this
                    O.hasData()
                    var aArr = [], ulModeDataLength = ulModeData.length
                    console.log(ulModeDataLength)
                    for(var r = 0; r < ulModeDataLength; r++){
                        var option = ''
                        if(r === 0){
                            option  = '<div class="option selected" ><a href="javascript:void 0;" value="'+ulModeData[r].value+'">'+ulModeData[r].text+'</a></div>'
                        }else if(ulModeDataLength > 9 && r === 8){
                            option = O.showAllSelects
                            aArr.push(option)
                            O.createShowAllContent(objId,ulModeData,title)
                            break
                        }
                        else {
                            option  = '<div class="option" ><a href="javascript:void 0;" value="'+ulModeData[r].value+'">'+ulModeData[r].text+'</a></div>'
                        }
                        aArr.push(option)
                    }
                    $('#'+objId).append(aArr.join(''))
                    O.showAllSelectsOnClick(objId)
                },
                //大于9时在另一处展示
                createShowAllContent: function (objId,ulModeData,title) {
                    var O = this
                    var arr = []
                    $('#'+objId).parent().children('.with_sub_title ').remove()
                    $('#'+objId).parent().append('<div class="with_sub_title zIndex444 hidden"><div class="sf_layer_sub_title"><strong>已选'+title+'：</strong><span class="words_10"></span></div></div>')
                    $('#'+objId).next().append(O.showAllModel)
                    for(var i=0;i<ulModeData.length;i++){
                        var li = '<li class="check_li"><div class="list_inner li_line"><div class="big" value="'+ulModeData[i].value+'">'+ulModeData[i].text+'</div></div></li>'
                        arr.push(li)
                    }
                    $('#'+objId).next().find('.mod_list').append(arr.join(''))
                },
                //展示全部
                showAllSelectsOnClick: function (objId) {
                    var O = this
                    $('#'+objId+'> .arrow').click(function () {
                        $(this).parent().next('.with_sub_title ').removeClass('hidden')
                        var value = $(this).parents('.mod_list').find('.right').children('.words_10').attr('value')
                        $('.zIndex444').not('.hidden').find('.big').each(function () {
                            var big = this
                            if($(big).attr('value') == value){
                                $(big).parents('.check_li').addClass('checked')
                                $(big).parents('.top46').prev().find('.words_10').text($(big).text()).attr('value',$(big).attr('value'))
                            }
                        })
                        $('.filterlayer_bottom_buttons').eq(0).addClass('hidden').siblings('.filterlayer_bottom_buttons').removeClass('hidden')
                        O.cancelSubTitle($(this))
                        O.confirmSubTitle($(this))
                        O.checkLiOnClick()
                    })
                },
                //查看全部后的取消按钮
                cancelSubTitle: function (dom) {
                    $('#cancel1').click(function () {
                        $(dom).parent().next('.with_sub_title ').addClass('hidden')
                            .find('.words_10').text('').end().find('.check_li').removeClass('checked')
                        $('.filterlayer_bottom_buttons').eq(1).addClass('hidden').siblings('.filterlayer_bottom_buttons').removeClass('hidden')
                    })
                },
                //查看全部后的确定按钮
                confirmSubTitle: function (callback) {
                    var O = this
                    $('#confir1').click(function () {
                        if(callback instanceof jQuery) {
                            $(callback).parent().next('.with_sub_title ').addClass('hidden')
                            var obj = $(callback).parent().next('.with_sub_title ').find('.check_li ').filter('.checked')
                            var text = obj.find('.big').text()
                            var value = obj.find('.big').attr('value')
                            $(callback).parent().prev().find('.words_10').text(text).attr('value', value)
                            $(callback).siblings('.option').not('.arrow').children().each(function () {
                                if ($(this).attr('value') === value) {
                                    $(this).parent().not('.arrow').addClass('selected').siblings().removeClass('selected')
                                    O.setClearButtonColor()
                                    return false
                                } else {
                                    $(callback).siblings('.option').removeClass('selected')
                                }
                            })
                            O.setClearButtonColor()
                        }
                        // else if(typeof callback == 'function'){
                        //     callback()
                        // }else {
                        //     return
                        // }
                    })
                    // var aa = 55
                    // return callback(aa)
                },
                //确定回调方法
                confirmSubTitleForDo: function (callback) {
                    var O = this
                    $('#confir1').click(function () {
                        if(typeof callback != 'function') return
                        var thisJson = {}
                        var thisValue = $('.zIndex444').not('.hidden').find('.checked').find('.big').attr('value')
                        var thisId = $('.zIndex444').not('.hidden').parent().attr('id')
                        thisJson[thisId] = thisValue
                        var valueJson = O.getAllValues()
                        var data = $.extend(valueJson, thisJson)
                        return callback(data)
                    })
                },
                //checkLi点击事件
                checkLiOnClick: function () {
                    $('.check_li').click(function () {
                        $(this).addClass('checked').siblings().removeClass('checked')
                        $(this).parents('.top46').siblings('.sf_layer_sub_title').find('.words_10').text($(this).find('.big').text()).attr('value',$(this).find('.big').attr('value'))
                    })
                },
                //更新筛选项内容
                reloadUlMod: function (ModId,data,title) {
                    var O = this
                    $('#'+ModId+'option').empty()
                    O.createUlMods(ModId+'option',data,title)
                    O.optionOnclick()
                    O.watchText()
                },
                //选中某项值 用于首页的回显
                selectUlModItem: function (ModId, value) {
                    var O = this
                    if( $('#'+ModId+'option').children().length == 1) {
                        $('#'+ModId+'option').find('#'+ ModId).val(value)
                        $('#'+ModId+'option').find('.words_10').text(value)
                    }else {
                        $('#'+ModId+'option').find('a').each(function () {
                            if($(this).attr('value')===value){
                                $(this).parent('.option').addClass('selected').siblings().removeClass('selected').parent('.tags_selection').prev('li').find('.words_10').text($(this).text()).attr('value',$(this).attr('value'))
                            }else {
                                $(this).parent('.option').removeClass('selected').parent().next().find('.big').each(function () {
                                    if($(this).attr('value')===value){
                                        $(this).parents('.zIndex444 ').siblings('li').find('.words_10').text($(this).text()).attr('value',$(this).attr('value'))
                                    }
                                })
                            }
                        })
                    }
                    O.setClearButtonColor()
                },
                optionOnclick: function (itemId,callback) {
                    var O = this
                    var selector = ''
                    if(itemId == undefined){
                        selector = '.option'
                    }else {
                        selector = '#'+itemId+'option .option'
                    }
                    $(selector).not('.arrow ').click(function () {
                        var ownText =  $(this).children().text()
                        var ownValue =  $(this).children().attr('value')
                        $(this).addClass('selected').siblings().removeClass('selected').parent('.tags_selection').prev('li').find('.words_10').text(ownText).attr('value',ownValue)
                        O.setClearButtonColor()
                        if(callback == undefined || typeof callback != 'function') return
                        callback()
                    })
                },
                hasData: function () {
                    if (settings.selectsData.length == 0) return
                },
                init: function () {
                    this.createElems()
                },
                //显示隐藏插件
                dialogOnClick: function (dObj) {
                    var O = this
                    dObj.click(function () {
                        O.dialog.toggleClass('show')
                        O.conditionalFilter.toggleClass('show')
                        O.box.toggleClass('show')
                        $.smartScroll($('#aside'), '.sf_layer_con');
                        $('html').addClass('noscroll')
                    })
                },
                //初始化按钮功能函数
                clearFilter: function () {
                    var O = this;
                    O.clearButton.click(function(){
                        $('.tags_selection .option:nth-child(1)').addClass('selected').siblings().removeClass('selected')
                        if(settings.hasDate){
                            $('#'+settings.setDateID).parent().next().children().text(settings.setDateTime)
                        }
                        O.watchText()
                        O.clearButton.addClass('hidden')
                        O.clearButtonDisabled.removeClass('hidden')
                    })
                },
                //设置初始化按钮颜色
                setClearButtonColor: function () {
                    var O = this;
                    var flag = false
                    $('.tags_selection .option:nth-child(1)').each(function () {
                        if(!$(this).hasClass('selected')) {
                            flag = true
                        }
                    })
                    if(settings.setDateTime != $('#'+settings.setDateID).val()){
                        flag = true
                    }
                    if(flag === true){
                        O.clearButton.removeClass('hidden')
                        O.clearButtonDisabled.addClass('hidden')
                    }else {
                        O.clearButtonDisabled.removeClass('hidden')
                        O.clearButton.addClass('hidden')
                    }

                },
                //更新li中text内容 返回选中数据
                watchText: function () {
                    var valueJson = {}
                    $('.option').each(function () {
                        if($(this).hasClass('selected')){
                            $(this).parent('.tags_selection').prev('li').find('.words_10').text($(this).text()).attr('value',$(this).find('a').attr('value'))
                            var fId = $(this).parents('ul.mod_list').attr('id')
                            valueJson[fId] = $(this).find('a').attr('value')
                        }
                    })
                    return valueJson
                },
                //确定方法回调函数
                confirmButton: function (callback) {
                    var O = this;
                    O.bottomButton.find('.bg2').not('.showAll').click(function () {
                        if(typeof callback != 'function') return
                        callback()
                        O.dialog.trigger('click')
                    })
                },
                getAllValues: function () {
                    var valueJson = {}
                    $('.right>.words_10').not('.dataSpan').each(function () {
                        var textValue = $(this).attr('value')
                        var textId = $(this).parents('ul').attr('id')
                        valueJson[textId] = textValue
                    })
                    if(settings.hasDate){
                        var value = $('#' + settings.setDateID).val()
                        valueJson[settings.setDateID] = value
                    }
                    return valueJson
                },
                initDateInput: function () {
                    var O =  this
                    if(!settings.hasDate) return
                    var nowData = settings.setDateTime
                    if(settings.setDateTime == '') {
                        var data = new Date();
                        var year = data.getFullYear()
                        var month = data.getMonth() + 1
                        var day =  data.getDate()-1
                        if(month<10){
                            month = '0'+month
                        }
                        if(day<10){
                            day = '0'+day
                        }
                        nowData = year + '-' + month + '-' + day
                    }
                    settings.setDateTime = nowData
                    var dateContent =
                        '<ul class="mod_list" id="'+settings.setDateID+'option">' +
                        '<li>' +
                        '<div class="list_inner li_line">' +
                        '<div class="big relative">日期' +
                        '<input type="date" id="'+settings.setDateID+'" class="dateSelecter" value="'+nowData+'">' +
                        '<a class="mui-icon mui-pull-right btn dateA">' +
                        '<span class="iconfont icon-riqi" style="color: #E93B3D;font-size: 24px"></span>' +
                        '</a>' +
                        '</div>' +
                        '<div class="right"><span class="words_10 dataSpan">'+nowData+'</span></div>' +
                        '</div>' +
                        '</li>' +
                        '</ul>'
                    O.conditionalFilter.find('.sf_layer_con').prepend(dateContent)
                },
                onInputDate: function () {
                    var O = this
                    $('#'+settings.setDateID).on('input',function () {
                        $(this).parent().next().children().text($(this).val())
                        if($(this).val()!=settings.setDateTime){
                            O.clearButton.removeClass('hidden')
                            O.clearButtonDisabled.addClass('hidden')
                        }else {
                            O.clearButtonDisabled.removeClass('hidden')
                            O.clearButton.addClass('hidden')
                        }
                    })
                }
            };
            conObj.optionsFunc.init();
        });
        return ret.length == 1 ? ret[0] : ret;
    };

}(jQuery));
