import { defineStore } from "pinia";

const privateFMStore = defineStore("privateFM", {
  state: () => {
    return {
      data: [],
    };
  },
  getters: {},
  actions: {},
});

export default privateFMStore;
