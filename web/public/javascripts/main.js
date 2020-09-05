import Vue from "vue";
import { DatePicker } from "ant-design-vue";
import App from "../../pages/index.vue";
import _ from "lodash";

Vue.use(DatePicker);

const app = new Vue({
  el: "#app",
  render: (h) => h(App),
});

export default app;
