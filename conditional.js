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
                dialog: '', //遮罩层
                conditionalFilter: '', //外层DIV
                clearButton:'',
                bottomButton: '',
                box: '',
                //初始化
                createElems: function () {
                    var O = this;
                    O.dialog = $('<div class="dialog"></div>')
                    O.box = $('<div class="aside" id="aside"></div>')
                    O.conditionalFilter = $('<div class="conditional-filter"><div class="sf_layer_con"></div></div>')
                    O.clearButton = $('<div id="filterClearBtn" class="J_ping s_btn hidden">初始化选项</div>')
                    O.clearButtonDisabled = $('<div id="filterClearBtnDisabled" class="J_ping s_btn disabled">初始化选项</div>')
                    O.bottomButton = $('<div class="filterlayer_bottom_buttons"><span class="filterlayer_bottom_button bg1">取消</span><span class="filterlayer_bottom_button bg2">确认</span></div>')
                    O.conditionalFilter.append(O.bottomButton )
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
                    O.bottomButton.find('.filterlayer_bottom_button:eq(0)').click(function () {O.dialog.trigger('click') })
                    O.createUl()
                    O.conditionalFilter.find('.sf_layer_con').append(O.clearButton ).append(O.clearButtonDisabled)
                    O.clearFilter()
                    // O.setClearButtonColor()
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
                            '<div class="right"><span class="words_10">'+settings.selectsData[i].data[0].text+'</span></div>' +
                            '</div>' +
                            '</li>' +
                            '<div class="tags_selection" id="'+settings.selectsData[i].id+'option'+'"></div>' +
                            '</ul>'
                        O.conditionalFilter.find('.sf_layer_con').append(ul)
                        var objId = settings.selectsData[i].id + 'option'
                        O.createUlMods(objId,ulModeData)
                    }
                    O.optionOnclick()
                    if(settings.hasDate){
                        O.initDateInput()
                        O.onInputDate()
                    }
                },
                createUlMods: function (objId,ulModeData) {
                    var O = this
                    O.hasData()
                    var aArr = []
                    for(var r = 0; r < ulModeData.length; r++){
                        var option = ''
                        if(r === 0){
                            option  = '<div class="option selected" ><a href="javascript:void 0;" value="'+ulModeData[r].value+'">'+ulModeData[r].text+'</a></div>'
                        }else {
                            option  = '<div class="option" ><a href="javascript:void 0;" value="'+ulModeData[r].value+'">'+ulModeData[r].text+'</a></div>'
                        }
                        aArr.push(option)
                    }
                    $('#'+objId).append(aArr.join(''))
                },
                //更新筛选项内容
                reloadUlMod: function (ModId,data) {
                    var O = this
                    $('#'+ModId+'option').empty()
                    O.createUlMods(ModId+'option',data)
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
                                $(this).parent('.option').addClass('selected').siblings().removeClass('selected').parent('.tags_selection').prev('li').find('.words_10').text($(this).text())
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
                    $(selector).click(function () {
                        var ownText =  $(this).children().text()
                        $(this).addClass('selected').siblings().removeClass('selected').parent('.tags_selection').prev('li').find('.words_10').text(ownText)
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
                            $(this).parent('.tags_selection').prev('li').find('.words_10').text($(this).text())
                            var fId = $(this).parents('ul.mod_list').attr('id')
                            valueJson[fId] = $(this).find('a').attr('value')
                        }
                    })
                    return valueJson
                },
                //确定方法回调函数
                confirmButton: function (callback) {
                    var O = this;
                    O.bottomButton.find('.bg2').click(function () {
                        if(typeof callback != 'function') return
                        callback()
                        O.dialog.trigger('click')
                    })
                },
                getAllValues: function () {
                    var O = this
                    var valueJson = O.watchText()
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
                        '<div class="right"><span class="words_10">'+nowData+'</span></div>' +
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
