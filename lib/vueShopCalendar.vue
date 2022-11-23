/*
* @Author: aFei
* @Date: 2021-06-09 17:04:54
*/
/*
 * @LastEditors: aFei
 * @LastEditTime: 2022-11-23 10:48:27
 */
<template>
  <div :class="['vue-shop-calendar', cname]">
    <div class="calendar-top">
      <div class="left-btn" @click="changeTime(2, -1)">&lt;</div>
      <div class="middle-msg">
        {{ selectDay.year }}{{ i18n ? "-" : "年"
        }}{{ selectDay.month > 9 ? selectDay.month : "0" + selectDay.month
        }}{{ i18n ? "" : "月" }}
        <div
          class="other-msg"
          v-if="selectDay.fullTime !== today.fullTime"
          @click="changeTime(1, today)"
        >
          今
        </div>
      </div>
      <div class="left-btn" @click="changeTime(2, 1)">&gt;</div>
    </div>
    <div class="calendar-title">
      <div v-for="(item, index) in topTitle" :key="index">
        {{ item }}
      </div>
    </div>
    <div class="calendar-body">
      <div
        :class="[
          item.valFullTime === today.valFullTime ? 'is-today' : '',
          item.day < 9 ? 'samll-num' : '',
          item.valFullTime === selectDay.valFullTime ? 'select' : '',
          item.weekDay === 6 || item.weekDay === 0 ? 'rest' : '',
          item.inMonth ? '' : 'not-in-month',
        ]"
        v-for="item in showDate"
        :key="item.fullTime"
        @click="changeTime(1, item)"
      >
        <div class="item-tit">
          {{ item.day }}
          <div
            class="special"
            v-if="
              workDayKey
                ? workDay.findIndex((one) => {
                    return one[workDayKey] === item.valFullTime;
                  }) !== -1
                : workDay.indexOf(item.valFullTime) !== -1
            "
          >
            {{ i18n ? "work" : "班" }}
          </div>
          <div
            class="special else"
            v-if="
              restDayKey
                ? restDay.findIndex((one) => {
                    return one[restDayKey] === item.valFullTime;
                  }) !== -1
                : restDay.indexOf(item.valFullTime) !== -1
            "
          >
            {{ i18n ? "rest" : "休" }}
          </div>
        </div>
        <div class="item-div-content">
          <slot
            name="dateCell"
            :date="item"
            :data="{
              isToday: item.valFullTime === today.valFullTime,
              isSelected: item.valFullTime === selectDay.valFullTime,
            }"
          >
            <div
              class="item"
              v-for="(one, oneIndex) in diyDay.filter((it) => {
                return it[diyDayDayKey] === item.valFullTime;
              })"
              :key="oneIndex"
            >
              {{ oneIndex + 1 }}. {{ one[diyDaySketchKey] }}
            </div>
          </slot>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: "vueShopCalendar",
  model: {
    prop: "value",
    event: "changeValue"
  },
  props: {
    value: {
      type: String,
      default: ""
    },
    cname: {
      // 自定义class
      type: String,
      default: ""
    },
    i18n: {
      // 开启国际化
      type: Boolean,
      default: false
    },
    firstDay: {
      // 周首日，1-7
      type: Number,
      default: 1
    },
    workDayKey: {
      // 法定加班日唯一key
      type: String,
      default: ""
    },
    workDay: {
      // 法定加班日
      type: Array,
      default: () => {
        return [];
      }
    },
    restDayKey: {
      // 法定休息日唯一key
      type: String,
      default: ""
    },
    restDay: {
      // 法定休息日
      type: Array,
      default: () => {
        return [];
      }
    },
    diyDayDayKey: {
      // 自定义节日日期唯一key
      type: String,
      default: "day"
    },
    diyDaySketchKey: {
      // 自定义节日简述唯一key
      type: String,
      default: "sketch"
    },
    diyDay: {
      // 自定义节日
      type: Array,
      default: () => {
        return [];
      }
    }
  },
  data() {
    return {
      // 表头
      topTitle: [],
      // 当月展示数据
      showDate: [],
      // 一个面板的最大数据，6*7
      maxLength: 42,
      // 今天
      today: {},
      // 选择的日期
      selectDay: {}
    };
  },
  created() {
    this.init();
  },
  methods: {
    // 初始化
    init() {
      this.today = this.checkOneDay(new Date());
      this.getTitle();
      if (this.value) {
        this.chageTimeUp(this.checkOneDay(new Date(this.value)));
      } else {
        this.changeTime(1, this.checkOneDay(new Date()));
      }
    },
    // 改变时间
    changeTime(type, obj) {
      let lin = {};
      if (type === 1) {
        // 点击日历中的天
        lin = { ...obj };
      } else {
        // 点击头部上/下月
        let linYear = this.selectDay.year,
          linMonth = this.selectDay.month;
        linMonth += obj;
        if (obj > 0) {
          if (linMonth > 12) {
            linMonth = 1;
            linYear += 1;
          }
        } else {
          if (linMonth < 1) {
            linMonth = 12;
            linYear -= 1;
          }
        }
        lin = this.checkOneDay(new Date(`${linYear}-${linMonth}-1`));
      }
      this.$emit("changeValue", lin.valFullTime);
      this.$nextTick(() => {
        if (!this.value) {
          this.chageTimeUp(this.checkOneDay(new Date(lin.valFullTime)));
        }
      });
    },
    // 更新改变时间后的数据
    chageTimeUp(obj) {
      if (
        this.selectDay.year !== obj.year ||
        this.selectDay.month !== obj.month
      ) {
        this.getData(obj.year, obj.month);
      }
      this.selectDay = { ...obj };
      this.$emit("change", this.selectDay, {
        startTime: this.showDate[0].valFullTime,
        endTime: this.showDate[this.maxLength - 1].valFullTime
      });
    },
    // 判断某一年是否为闰年
    checkLeapYear(year) {
      return year % 4 === 0
        ? year % 100 === 0
          ? year % 400 === 0
            ? true
            : false
          : true
        : false;
    },
    // 检测某年某月有多少天
    checkDays(year, month) {
      switch (month) {
        case 1:
        case 3:
        case 5:
        case 7:
        case 8:
        case 10:
        case 12:
          return 31;
        case 2:
          return this.checkLeapYear(year) ? 29 : 28;
        case 4:
        case 6:
        case 9:
        case 11:
          return 30;
      }
    },
    // 将某一天输出为标准化对象格式
    checkOneDay(time) {
      return {
        year: time.getFullYear(),
        month: time.getMonth() + 1,
        day: time.getDate(),
        weekDay: time.getDay(),
        fullTime: `${time.getFullYear()}-${time.getMonth() +
          1}-${time.getDate()}`,
        valFullTime: `${time.getFullYear()}-${
          time.getMonth() + 1 > 9
            ? time.getMonth() + 1
            : "0" + (time.getMonth() + 1)
        }-${time.getDate() > 9 ? time.getDate() : "0" + time.getDate()}`
      };
    },
    // 设置表头
    getTitle() {
      let standWeek = this.i18n
        ? ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]
        : ["一", "二", "三", "四", "五", "六", "日"];
      let num = this.firstDay - 1;
      for (let i = 0; i < 7; i++, num++) {
        if (num > 6) {
          num = 0;
        }
        this.topTitle.push(standWeek[num]);
      }
    },
    // 输入当月数据
    getData(year, month) {
      this.showDate = [];
      // 添加当月数据
      for (let i = 0; i < this.checkDays(year, month); i++) {
        let obj = this.checkOneDay(new Date(`${year}-${month}-${i + 1}`));
        obj.inMonth = true;
        this.showDate.push(obj);
      }
      // 添加上个月数据
      let beforeYear = year,
        beforeMonth = month - 1,
        beforeNum = this.showDate[0].weekDay - this.firstDay;
      if (beforeMonth === 0) {
        beforeYear = year - 1;
        beforeMonth = 12;
      }
      if (beforeNum < 0) {
        beforeNum += 7;
      }
      for (let i = 0; i < beforeNum; i++) {
        let obj = this.checkOneDay(
          new Date(
            `${beforeYear}-${beforeMonth}-${this.checkDays(
              beforeYear,
              beforeMonth
            ) - i}`
          )
        );
        obj.inMonth = false;
        this.showDate.unshift(obj);
      }
      // 添加下个月数据
      let afterYear = year,
        afterMonth = month + 1,
        afterNum = this.maxLength - this.showDate.length;
      if (afterMonth === 13) {
        afterYear = year + 1;
        afterMonth = 1;
      }
      for (let i = 0; i < afterNum; i++) {
        let obj = this.checkOneDay(
          new Date(`${afterYear}-${afterMonth}-${i + 1}`)
        );
        obj.inMonth = false;
        this.showDate.push(obj);
      }
    }
  },
  watch: {
    value() {
      this.chageTimeUp(this.checkOneDay(new Date(this.value)));
    }
  }
};
</script>

<!--基础样式-->
<style>
@import "style/vueShopCalendar.css";
</style>