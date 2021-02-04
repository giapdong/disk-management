<template>
  <section class="ant-layout app h-100 bg-white">
    <header class="ant-layout-header">
      <div class="app-container-content">
        <div class="app-header-logo" @click="gotoHome">
          <div class="ant-col-12">
            <div class="ant-col-4 h-100 app-header-logo-icon">
              <img
                class="h-100 w-100"
                src="dist/images/icon.svg"
                alt="Logo disk management"
              />
            </div>
            <div class="ant-col-20 h-100 px-1 app-header-logo-title">
              <span>Disk management</span>
            </div>
          </div>
        </div>
        <div class="app-header-menu">
          <NPMicon />
          <a-icon class="ml-1" type="github" @click="gotoGithub" />
        </div>
      </div>
    </header>

    <main class="ant-row ant-layout-content app-container-content p-1">
      <div class="ant-col ant-col-4 h-100">
        <LeftBar />
      </div>
      <div class="ant-col ant-col-20 h-100">
        <MainContent />
      </div>
    </main>

    <footer class="ant-layout-footer bg-white">
      <div class="app-container-content h-100">
        <span class="text-bold">©COPYRIGHT BY DevP Studio 2020</span>
      </div>
    </footer>
  </section>
</template>

<script>
import { mapState, mapActions } from "vuex";
import NPMicon from "@/components/icon/NPMicon.vue";
import LeftBar from "@/components/LeftBar/index.vue";
import MainContent from "@/components/MainContent/index.vue";

export default {
  name: "dashboard",
  components: {
    NPMicon,
    LeftBar,
    MainContent,
  },
  async created() {
    this.getPartition();
  },
  methods: {
    ...mapActions({
      getPartition: "getPartition",
    }),
    gotoGithub() {
      window.open("https://github.com/giapdong/disk-management");
    },
    gotoHome() {
      this.$store.state.partitionSelected = null;
    },
  },
};
</script>

<style lang="less" scoped>
@import "mixin";
.app {
  .ant-layout-header {
    top: 0px;
    z-index: 10;
    position: sticky;
    background: #2b3a42;

    .app-container-content {
      height: 100%;
      display: flex;
      color: white;
      flex-direction: row;
      background: #2b3a42;
      justify-content: space-between;

      .app-header-logo {
        height: 100%;
        display: flex;
        width: fit-content;
        flex-direction: row;
        cursor: pointer;

        &-icon {
          display: flex;
        }

        &-title {
          display: flex;
          align-items: center;
          font-size: 1.2rem;
          font-weight: bold;
        }
      }

      .app-header-menu {
        width: fit-content;
      }
    }
  }

  .ant-layout-content {
    color: black;
    height: calc(80% - 64px);
  }

  .ant-layout-footer {
    padding: 0px !important;
    height: calc(20% - 64px);

    .app-container-content {
      border-top: 1px solid rgba(0, 0, 0, 0.3);
      display: flex;
      justify-content: center;
    }
  }
}
</style>
