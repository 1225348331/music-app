import { defineStore } from "pinia";

const mainStore = defineStore("mainStore", {
  state: () => {
    return {
      data: "",
    };
  },
  getters: {},
  actions: {},
});

export default mainStore;
