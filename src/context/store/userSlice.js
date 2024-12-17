export const userSlice = (set, get) => ({
    userName: '',
    headers: {},
    mobileDevice: false,
    userOptions: {},
    updateUserName: (currentUserName) => set((state) => ({ ...state, userName: currentUserName })),
    updateHeaders: (currentToken) => set((state) => (
        {
            ...state,
            headers:
                currentToken ? { Authorization: `Bearer ${currentToken}`, 'Content-Type': 'application/json' } : {}
        }
    )),
    setMobileDevice: (newValue) => set((state) => ({ ...state, mobileDevice: newValue })),
    getMobileDevice: () => get().mobileDevice,
    setUserOptions: (newOptions) => set((state) => ({ ...state, userOptions: newOptions })),
    getUserOptions: () => get().userOptions,
});