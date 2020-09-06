import Vue from "vue";
import Ant from "ant-design-vue";
import App from "../../pages/index.vue";
import _ from "lodash";

Vue.use(Ant);
Vue.set(Vue.prototype, "_", _);

const app = new Vue({
  el: "#app",
  render: (h) => h(App),
});

export default app;
