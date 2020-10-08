<template>
  <div class="app-main-content w-100 h-100 p-2">
    <div v-if="partitionSelected" class="app-main-content-board w-100 h-100">
      center
    </div>
    <div v-else class="app-main-content-empty w-100 h-100">
      <img src="dist/images/icon.svg" alt="Logo disk management" />
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";
export default {
  name: "MainContent",
  computed: {
    ...mapState({
      partitionSelected: (state) => state.partitionSelected,
    }),
  },
  watch: {
    partitionSelected(newVal) {
      console.log("selected", newVal);
    },
  },
};
</script>

<style lang="less" scoped>
.app-main-content {
  &-empty {
    display: flex;
    align-items: center;
    justify-content: center;

    img {
      width: 30%;
      height: 30%;
    }
  }

  &-board {
    border: 1px solid red;
  }
}
</style>
