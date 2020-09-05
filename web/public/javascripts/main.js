import Vue from "vue";

import App from "../../pages/index.vue";

import _ from "lodash";

const app = new Vue({
  el: "#app",
  render: (h) => h(App),
});

export default app;
