// CloudDance Calendar
// Joe Friedlander
// https://github.com/JoeFriedlander/cloudDance

import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import VueClipboard from "vue-clipboard2";
import vuetify from "./plugins/vuetify";
import moment from "moment";
Vue.prototype.moment = moment;

Vue.use(VueClipboard);
Vue.config.productionTip = false;

export const calendarBus = new Vue();
export const eventBus = new Vue();

new Vue({
  router,
  store,
  vuetify,
  render: h => h(App)
}).$mount("#app");
