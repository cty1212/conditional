# 插件使用方法

引入文件
-------
项目中引入conditional.css和conditional.js

html部分
-------
header标签后放入
` `` <a href="javascript:void 0;" class="btnSx">筛选<i class="iconfont icon-shaixuan"></i></a>
` `` 
标签

插件API及初始化方法
----- 
  初始化方法实例：  
  
  var data = {id:'brand',title: '品牌',data: [{value:'1',text:'apple'},{value:'1',text:'apple3'}]}   
  
  var data1 = {id:'model',title: '机型',data: [{value:'1',text:'apple11S 64G'},{value:'1',text:'apple2'}]}   
  
  var data2 = {id:'xh',title: '型号',data: [{value:'5',text:'apple11S 64G aaa'}]}  
  
  selectsData.push(data,data1,data2)     
  
  $('.btnSx').Conditional({      
  
      selectsData:selectsData,  //筛选项数据集 格式按照上方示例  ID为筛选项ID title为筛选项名字 data为筛选项数据    
      
      hasDate: true,    // 是否开启日期控件 默认为fale      
      
      setDateTime: '2018-10-20',   //日期控件初始时间 为空时默认展示昨日日期    
      
      setDateID: 'dateId'          //，日期控件ID ， hasDate为true时不可为空     
      
  })    
  
  API  
  ---
  selectUlModItem(筛选项ID,data中value值)  设置某项值为选中状态 应用场景：下钻后返回上一级的回显
  --
  $('.btnSx')[0].optionsFunc.selectUlModItem('xh','gb004')
  
  reloadUlMod(筛选项ID,data值)  重新渲染筛选项 应用场景：级联
  --
  $('.btnSx')[0].optionsFunc.reloadUlMod('model',[{value:'1',text:'apple2211S 64G'},{value:'1',text:'ap22ple2'}])
  
  optionOnclick(筛选项ID,callback) 点击筛选项时的回调函数 应用场景：级联
  --
   $('.btnSx')[0].optionsFunc.optionOnclick('model', function () {
  //dosomething
  })
  
  confirmButton(callback)  确定按钮回调函数 应用场景：ajax查询
  --
  $('.btnSx')[0].optionsFunc.confirmButton(function () {
    //dosomething
  })
  
  getAllValues()  获取选中的所有value值 应用场景：取值
  --
  var valueJson = $('.btnSx')[0].optionsFunc.getAllValues()
