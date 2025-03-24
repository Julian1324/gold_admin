export const categorySlice = (set, get) => ({
    categories: [],
    updateCategories: (newCategories) => set({ categories: newCategories }),
    getCategories: () => get().categories,
});