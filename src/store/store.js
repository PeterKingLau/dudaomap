import { defineStore } from "pinia";

export const useMarkerStore = defineStore("marker", {
  state: () => ({
    markerMess: {},
  }),
  getters: {
    getmarkerMess: (state) => state.markerMess,
  },
  actions: {
    updatemarkerMess(data) {
      this.markerMess = data;
    },
  },
  persist: true,
});
