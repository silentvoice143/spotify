import React, { createContext, useState, useEffect } from "react";
import { Cookies, useCookies } from "react-cookie";

// Create a context with an initial value (in this case, an empty string)
const AuthContext = createContext("");

// Step 2: Create a provider component
const AuthProvider = ({ children }) => {
  const [loading, setLoading] = useState(false);
  const [cookies, setCookie, removeCookie] = useCookies(["token", "user"]);
  const [isAuthenticated, setIsAuthenticated] = useState(cookies.token); // null represents the initial loading state
  const [user, setUser] = useState(cookies.user);
  const [isAdmin, setIsAdmin] = useState(false);

  const login = (token, userData) => {
    setCookie("token", token, { path: "/", maxAge: 30 * 24 * 60 * 60 });
    setCookie("user", userData, { path: "/", maxAge: 30 * 24 * 60 * 60 });
    setIsAuthenticated(true);
  };

  const logout = () => {
    removeCookie("token", { path: "/" });
    removeCookie("user", { path: "/" });
    setIsAuthenticated(false);
    // console.log("done");
  };

  useEffect(() => {
    // console.log(user);
    // Simulate an asynchronous check for authentication
    const checkAuthStatus = () => {
      // Update the authentication status based on the presence of a token
      const storedToken = cookies.token;
      if (storedToken) {
        setUser(cookies.user);
        // console.log(user);
        if (cookies.user) {
          setIsAdmin(cookies.user.isAdmin);
        }

        setIsAuthenticated(true);
      }
    };

    checkAuthStatus();
  }, [cookies.token]);

  return (
    <AuthContext.Provider
      value={{
        setIsAuthenticated,
        isAuthenticated,
        login,
        logout,
        loading,
        setLoading,
        isAdmin: isAdmin,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export { AuthContext, AuthProvider };
