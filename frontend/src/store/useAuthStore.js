import { create } from "zustand";

const useAuthStore = create((set) => ({
    user: null,
    token: localStorage.getItem("token") || null,
    isAuthenticated: false,

    login: (user, token) => {
        localStorage.setItem("token", token);
        set({ user, token, isAuthenticated: true });
    },

    logout: () => {
        localStorage.removeItem("token");
        set({ user: null, token: null, isAuthenticated: false })
    },

    setUser: (user) => set({ user }),  //  used to update user info without touching the token
}));

export default useAuthStore;

// user => stores logged in user's data
// token => stores jwt token. so even if user refreshes the page they stay logged in
// isAuthenticated => a simple true/false that tells us if someone is logged in
