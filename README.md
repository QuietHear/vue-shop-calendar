# 工作日历（vue2版）
[**vue3版本**](https://github.com/QuietHear/vue-shop-calendar-plus '浏览') | ***vue2版本*** 


## 安装
	npm i vue-shop-calendar

## 使用
	import vueShopCalendar from 'vue-shop-calendar';
	
	Vue.use(vueShopCalendar);


## 1. 参数
* `v-model`：当前选择的日期，双向绑定-->String;非必传;默认当天

* `cname`：自定义class-->String;非必传;默认''

* `i18n`：开启国际化-->Boolean;非必传;默认false

* `firstDay`：周首日-->Number;非必传;默认1
>
	1-7
>

* `workDayKey`：法定加班日唯一key-->String;非必传;默认''

* `workDay`：法定加班日-->Array;非必传;默认[]
>
	// 日期的数据格式必须为：YYYY-MM-DD
	// 如果workDayKey未传值或者为空值，对比的直接是item
	eg:['2021-08-01','2021-08-02']
	// 如果workDayKey有传值，对比的是item[workDayKey]
	eg:[{day:'2021-08-01'},{day:'2021-08-02'}]
>

* `restDayKey`：法定休息日唯一key-->String;非必传;默认''

* `restDay`：法定休息日-->Array;非必传;默认[]
>
	// 日期的数据格式必须为：YYYY-MM-DD
	// 如果restDayKey未传值或者为空值，对比的直接是item
	eg:['2021-08-01','2021-08-02']
	// 如果restDayKey有传值，对比的是item[restDayKey]
	eg:[{day:'2021-08-01'},{day:'2021-08-02'}]
>

* `diyDayDayKey`：自定义节日日期唯一key-->String;非必传;默认'day'

* `diyDaySketchKey`：自定义节日简述唯一key-->String;非必传;默认'sketch'

* `diyDay`：自定义节日-->Array;非必传;默认[]
>
	// 日期的数据格式必须为：YYYY-MM-DD
	// 对比日期为item[diyDayDayKey]，展示简述为item[diyDaySketchKey]
	eg:[{day:'2021-08-01',sketch:'111'},{day:'2021-08-01',sketch:'222'}]
>

* `@change`：时间改变-->返参如下
>
	// 在这个地方向后台获取所有的特殊日期，因为这里有面板中的时间范围，建议用第二个参数作为条件
	第一个参数：当前选择日期的详细数据
	第二个参数：当前面板的开始日期-结束日期
>


## 2. 插槽
`<template slot="dateCell" slot-scope="{ date, data }"> {{date}}{{data}} </template>`
>
	// 默认情况下插槽会展示自定义节日的内容
	// date返回当前单元格的日期属性
	// data返回是否为今天、是否被选中两个属性
>