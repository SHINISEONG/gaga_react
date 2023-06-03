import { create } from "zustand";

const useSearchClubFormStore = create((set) => ({
  searchKeyword: "",
  setField: (field, value) => set({ [field]: value }),
  reset: () => set({ searchKeyword: "" }),
}));

export default useSearchClubFormStore;