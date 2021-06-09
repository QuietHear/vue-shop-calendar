/*
* @Author: aFei
* @Date: 2021-06-09 17:04:54
*/
/*
 * @LastEditors: afei
 * @LastEditTime: 2021-06-09 17:07:16
 */
import vueShopCalendar from './vueShopCalendar';

const comment = {
  install(Vue) {
    Vue.component('vueShopCalendar', vueShopCalendar);
  },
};
if (typeof window !== 'undefined' && window.Vue) {
  window.Vue.use(comment);
}

export default comment;