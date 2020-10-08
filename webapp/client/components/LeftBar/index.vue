<template>
  <div class="w-100 h-100 app-left-bar">
    <Partition
      v-for="(item, index) in partition"
      :key="index"
      :index="index"
      :data-source="item"
    />
  </div>
</template>

<script>
import { mapState } from "vuex";
import Partition from "@/components/LeftBar/Partition.vue";

export default {
  name: "LeftBar",
  components: {
    Partition,
  },
  computed: {
    ...mapState({
      partition: (state) => state.partition,
    }),
  },
};
</script>

<style lang="less" scoped>
.app-left-bar {
  & .app-partition:not(:first-child) {
    margin-top: 0.25rem;
  }
}
</style>
