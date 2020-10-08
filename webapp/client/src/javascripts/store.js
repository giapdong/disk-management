import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);
const self = Vue.prototype;

export default new Vuex.Store({
  state: {
    partition: [],
    partitionSelected: null,
  },
  actions: {
    async getPartition({ state, commit }, payload) {
      let { data } = await self.$request.get("os/partition");
      state.partition = data.data;
    },
    async selectDisk({ state }, payload) {
      state.partitionSelected = payload;
    },
  },
});
