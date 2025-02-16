import { createContext, useContext, useState, useEffect } from "react";

// ✅ Create Auth Context
const AuthContext = createContext();

// ✅ Provide Auth State to Entire App
export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);

    // ✅ Load user from localStorage when app starts
    useEffect(() => {
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
    }, []);

    // ✅ Login Function (Updates user globally)
    const login = (userData) => {
        localStorage.setItem("user", JSON.stringify(userData));
        setUser(userData); // ✅ Updates state without needing refresh
    };

    // ✅ Logout Function
    const logout = () => {
        localStorage.removeItem("user");
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

// ✅ Custom Hook to Use Auth Context
export const useAuth = () => useContext(AuthContext);
