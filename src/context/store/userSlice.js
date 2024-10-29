export const userSlice = (set, get) => ({
    userName: '',
    headers: {},
    mobileDevice: false,
    updateUserName: (currentUserName) => set((state) => ({ ...state, userName: currentUserName })),
    updateHeaders: (currentToken) => set((state) => (
        {
            ...state,
            headers:
                currentToken ? { Authorization: `Bearer ${currentToken}`, 'Content-Type': 'application/json' } : {}
        }
    )),
    setMobileDevice: (newValue) => set((state) => ({ ...state, mobileDevice: newValue })),
    getMobileDevice: () => get().mobileDevice
});