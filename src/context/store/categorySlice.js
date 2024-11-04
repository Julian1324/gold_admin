export const categorySlice = (set, get) => ({
    categories: [],
    updateCategories: (newCategories) => set((state) => ({ ...state, categories: newCategories })),
    getCategories: () => get().categories
});