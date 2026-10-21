import { create } from "zustand";

export const useMediaStore = create((set) => ({
  activeMedia: null,

  openMedia: (media) => {
    set({
      activeMedia: media,
    });
  },

  closeMedia: () => {
    set({
      activeMedia: null,
    });
  },
}));
