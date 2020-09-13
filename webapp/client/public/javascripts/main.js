import Vue from "vue";
import { Icon } from "ant-design-vue";
import App from "../../pages/index.vue";
import _ from "lodash";

Vue.use(Icon);
Vue.set(Vue.prototype, "_", _);

const app = new Vue({
  el: "#app",
  render: (h) => h(App),
});

export default app;
