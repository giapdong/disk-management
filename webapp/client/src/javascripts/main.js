import "babel-polyfill";
import Vue from "vue";
import _ from "lodash";
import { Icon } from "ant-design-vue";
import App from "../../pages/index.vue";
import Request from "./api-plugin.js";

Vue.use(Icon);
Vue.use(Request);
Vue.set(Vue.prototype, "_", _);

const app = new Vue({
  el: "#app",
  render: (h) => h(App),
});

export default app;
