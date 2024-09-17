// useUser.js
import { createContext, useContext, useState, useEffect } from 'react';

const UserContext = createContext();

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};

export const UserProvider = ({ children }) => {
  const [userInfo, setUserInfo] = useState(null);

  useEffect(() => {
    // Check localStorage for user information
    const storedUserInfo = localStorage.getItem('userInfo');
    if (storedUserInfo) {
      setUserInfo(JSON.parse(storedUserInfo));
    }
  }, []);

  const login = (user) => {
    setUserInfo(user);
    localStorage.setItem('userInfo', JSON.stringify(user));
  };

  const logout = () => {
    setUserInfo(null);
    localStorage.removeItem('userInfo');
  };
  return (
    <UserContext.Provider value={{ userInfo, login, logout }}>
      {children}
    </UserContext.Provider>
  );
};

